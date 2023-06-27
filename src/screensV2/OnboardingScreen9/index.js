import React, {useEffect, useState} from 'react';
import {View, Image, Pressable, TextInput, SafeAreaView, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';
import Button from '../../componentsV2/Inputs/Button';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen9 = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [loyalty, setLoyalty] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [user, setUser] = useState(null);
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  const bed = route.params?.bed;
  const title = route.params?.title;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const imageUrls = route.params?.imageUrls;
  const homeprice = route.params?.homeprice;
  const latitude = route.params?.latitude;
  const longitude = route.params?.longitude;
  const type = route.params?.type;
  const description = route.params?.description;
  const mode = route.params?.mode;
  const amenities = route.params?.amenities;
  const phoneNumber = route.params?.phoneNumber;
  const locality = route.params?.locality;
  const sublocality = route.params?.sublocality;
  const address = route.params?.address;
  const currency = route.params?.currency;
  const marketerNumber = route.params?.marketerNumber;
  const [availableForRent, setAvailableForRent] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [availabilityDate, setAvailabilityDate] = useState(null);
  const [homeownerName, setHomeownerName] = useState('');

  const saveProgress = async progressData => {
    try {
      const user = auth().currentUser;
      const screenName = route.name;
      const userId = user.uid;
      await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          progress: {
            screenName,
            progressData,
          },
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const handleLoyaltyPress = () => {
    setLoyalty(!loyalty);
  };
  const handleNegotiablePress = () => {
    setNegotiable(!negotiable);
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleFurnishedPress = () => {
    setFurnished(!furnished);
  };
  const handleAvailableForRent = value => {
    setAvailableForRent(value);
    // showDatePicker();
    if (!value) {
      showDatePicker();
    }
  };
  const goFaqs = () => {
    navigation.navigate('OnboardingScreen15');
  };
  const goBack = () => {
    navigation.goBack();
  };
  const handleConfirm = date => {
    // Save the selected date here
    setAvailabilityDate(date);
    hideDatePicker();
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const userDetails = async () => {
    const {currentUser} = auth();
    if (currentUser) {
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      if (userDoc.exists) {
        setUser(userDoc.data());
        // console.log('User data:', user);
        // Do something with user data
      }
    }
  };
  const getUsersWithPrivileges = async () => {
    try {
      const callers = await firestore().collection('usersWithPrivileges');
      callers.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          setUsersWithPrivileges(prev => [...prev, doc.data().userId]);
        });
      });
    } catch (error) {}
  };
  const handleNextPress = async () => {
    if (!homeownerName || availableForRent === null) {
      return;
    }
    await saveProgress({
      title,
      type,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      homeprice,
      latitude,
      longitude,
      mode,
      amenities,
      phoneNumber,
      marketerNumber,
      locality,
      sublocality,
      currency,
      negotiable: negotiable ? 'Yes' : 'No',
      loyaltyProgram: loyalty ? 'Yes' : 'No',
      furnished: furnished ? 'Yes' : 'No',
      address,
      available: availableForRent ? 'Yes' : 'No',
      availabilityDate: availabilityDate || null,
      homeownerName,
    });

    navigation.navigate('OnboardingScreen15', {
      title,
      type,
      description,
      bed,
      bedroom,
      bathroom,
      imageUrls,
      homeprice,
      latitude,
      longitude,
      mode,
      amenities,
      phoneNumber,
      marketerNumber,
      locality,
      sublocality,
      currency,
      negotiable: negotiable ? 'Yes' : 'No',
      loyaltyProgram: loyalty ? 'Yes' : 'No',
      furnished: furnished ? 'Yes' : 'No',
      address,
      available: availableForRent ? 'Yes' : 'No',
      availabilityDate: availabilityDate || null,
      homeownerName,
    });
  };
  useEffect(() => {
    userDetails();
    getUsersWithPrivileges();
    return () => {};
  }, [user]);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton} onPress={goBack}>
              <Image source={BackArrow} />
            </Pressable>
            <View style={styles.topButtons}>
              <Pressable style={styles.topButton} onPress={handleNextPress}>
                <Typography style={styles.topButtonText}>Save & exit</Typography>
              </Pressable>
              <Pressable style={styles.topButton} onPress={goFaqs}>
                <Typography style={styles.topButtonText}>FAQs</Typography>
              </Pressable>
            </View>
          </View>

          <Typography bold style={styles.title}>
            Your home is?
          </Typography>
          {usersWithPrivileges.includes(auth().currentUser.uid) ||
          user?.marketer_status === 'ACCEPTED' ? (
            <Pressable style={[styles.itemData]} onPress={handleLoyaltyPress}>
              <Typography bold>Loyalty Home</Typography>
              <Typography style={{color: '#4D4D4D'}}>
                You have given a loyalty package to this homeowner
              </Typography>
            </Pressable>
          ) : null}

          <Pressable style={[styles.itemData]} onPress={handleNegotiablePress}>
            <Typography bold>Negotiable</Typography>
            <Typography style={{color: '#4D4D4D'}}>
              Price can be negotiated with the home owner
            </Typography>
          </Pressable>
          <Pressable style={[styles.itemData]} onPress={handleFurnishedPress}>
            <Typography bold>Furnished</Typography>
            <Typography style={{color: '#4D4D4D'}}>
              Property comes with furniture and amenities
            </Typography>
          </Pressable>
          <Typography style={styles.homeOwner} bold>
            Enter the homeowner’s name
          </Typography>
          <TextInput
            placeholder="Homeowner’s Name"
            style={styles.input}
            onChangeText={text => setHomeownerName(text)}
            value={homeownerName}
          />
          <Typography style={{textAlign: 'center', marginTop: 28}} bold>
            Is your home available for rent now?
          </Typography>
          <View style={styles.btn}>
            <Button text="Yes" style={styles.btnYes} onPress={() => handleAvailableForRent(true)} />
            {/* <Button text="No" variant="defaultText" style={styles.btnNo} /> */}
            <Pressable style={styles.btnNo} onPress={() => handleAvailableForRent(false)}>
              <Typography style={{color: '#194CC3', textAlign: 'center', paddingTop: 15}}>
                No
              </Typography>
            </Pressable>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            // eslint-disable-next-line react/jsx-no-bind
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            // eslint-disable-next-line react/jsx-no-bind
            customHeaderIOS={() => (
              <View style={styles.customHeader}>
                <Typography style={styles.customHeaderText}>
                  Select when your home will be available
                </Typography>
              </View>
            )}
            // eslint-disable-next-line react/jsx-no-bind
            customHeaderAndroid={() => (
              <View style={styles.customHeader}>
                <Typography style={styles.customHeaderText}>
                  Select when your home will be available
                </Typography>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View
        style={{
          width: wp(100),
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{paddingHorizontal: offsets.offsetB}}>
          <DividedProgress total={4} progress={2} style={{marginBottom: offsets.offsetB}} />
        </View>
        <BottomActionsBar leftText="Back" rightText="Next" rightAction={handleNextPress} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen9;
