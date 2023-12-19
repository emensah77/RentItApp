import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCallback, useEffect, useState} from 'react';

const useViewLimit = (userId, limit = 2) => {
  const [canView, setCanView] = useState(true);

  const checkPaymentStatus = useCallback(async () => {
    const paymentKey = `subscriptionPayment_${userId}`;
    const hasPaid = await AsyncStorage.getItem(paymentKey);
    return hasPaid === 'true';
  }, [userId]);

  const checkViewLimit = useCallback(async () => {
    const hasPaid = await checkPaymentStatus();
    if (hasPaid) {
      setCanView(true);
      return;
    }

    const key = `globalViewCount_${userId}`;
    const viewCount = (await AsyncStorage.getItem(key)) || '0';
    setCanView(parseInt(viewCount, 10) < limit);
  }, [userId, limit, checkPaymentStatus]);

  const incrementViewCount = useCallback(async () => {
    const hasPaid = await checkPaymentStatus();
    if (hasPaid) {
      return;
    }

    const key = `globalViewCount_${userId}`;
    const currentCount = (await AsyncStorage.getItem(key)) || '0';
    if (parseInt(currentCount, 10) < limit) {
      const newCount = parseInt(currentCount, 10) + 1;
      await AsyncStorage.setItem(key, newCount.toString());
      setCanView(newCount < limit);
    }
  }, [userId, limit, checkPaymentStatus]);

  useEffect(() => {
    checkViewLimit();
  }, [userId, checkViewLimit]);

  return {canView, incrementViewCount};
};

export default useViewLimit;
