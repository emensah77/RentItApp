import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useCallback, useEffect, useState} from 'react';

const useViewLimit = (userId, limit = 2) => {
  const [canView, setCanView] = useState(true);

  const synchronizeFirestore = useCallback(
    async (key, value) => {
      try {
        const userDocRef = firestore().collection('users').doc(userId);
        await userDocRef.set({[key]: value}, {merge: true});
      } catch (error) {
        console.error('Error synchronizing Firestore:', error);
      }
    },
    [userId],
  );

  const checkPaymentStatus = useCallback(async () => {
    try {
      const paymentKey = `subscriptionPayment_${userId}`;
      const hasPaidAsync = await AsyncStorage.getItem(paymentKey); // might be null

      const userDoc = await firestore().collection('users').doc(userId).get();
      const hasPaidFirestore = userDoc.exists && userDoc.data().hasPaid; // might be undefined

      // If both AsyncStorage is null and Firestore is undefined, treat as not paid
      if (hasPaidAsync === null && hasPaidFirestore === undefined) {
        return false;
      }

      // If hasPaidAsync is 'true' and Firestore does not have data, update Firestore
      if (hasPaidAsync === 'true' && hasPaidFirestore === undefined) {
        await synchronizeFirestore('hasPaid', true);
      }

      // Return true if either source indicates the user has paid
      return hasPaidAsync === 'true' || hasPaidFirestore;
    } catch (error) {
      console.error('Error checking payment status:', error);
      return false;
    }
  }, [userId, synchronizeFirestore]);

  const checkViewLimit = useCallback(async () => {
    try {
      const hasPaid = await checkPaymentStatus();
      if (hasPaid) {
        setCanView(true);
        return;
      }

      const key = `globalViewCount_${userId}`;
      const viewCountAsync = parseInt((await AsyncStorage.getItem(key)) || '0', 10);

      const userDoc = await firestore().collection('users').doc(userId).get();
      const viewCountFirestore = userDoc.exists && userDoc.data().viewCount;

      const viewCount = Math.max(viewCountAsync, viewCountFirestore || 0);
      setCanView(viewCount < limit);

      // Synchronize Firestore with AsyncStorage data if necessary
      if (viewCount !== viewCountFirestore) {
        await synchronizeFirestore('viewCount', viewCount);
      }
    } catch (error) {
      console.error('Error checking view limit:', error);
    }
  }, [checkPaymentStatus, userId, limit, synchronizeFirestore]);

  const incrementViewCount = useCallback(async () => {
    try {
      const hasPaid = await checkPaymentStatus();
      if (hasPaid) return;

      const key = `globalViewCount_${userId}`;
      const currentCountAsync = parseInt((await AsyncStorage.getItem(key)) || '0', 10);

      if (currentCountAsync < limit) {
        const newCount = currentCountAsync + 1;
        await AsyncStorage.setItem(key, newCount.toString());

        // Update Firestore as well
        await synchronizeFirestore('viewCount', newCount);

        setCanView(newCount < limit);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }, [userId, limit, checkPaymentStatus, synchronizeFirestore]);

  useEffect(() => {
    checkViewLimit();
  }, [userId, checkViewLimit]);

  return {canView, incrementViewCount};
};

export default useViewLimit;
