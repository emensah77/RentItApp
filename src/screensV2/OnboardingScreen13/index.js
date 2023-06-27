import React, {useState, useRef} from 'react';
import {View, Text, Image, Pressable, SafeAreaView, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import PhoneInput from 'react-native-phone-number-input';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';
import {offsets} from '../../styles/globalStyles';
import DividedProgress from '../../componentsV2/DataDisplay/DividedProgress';
import BottomActionsBar from '../../componentsV2/Inputs/BottomActionsBar';

const OnboardingScreen13 = () => {
  const navigation = useNavigation();
  const phoneInput = useRef(null);
  const route = useRoute();

  const [phoneNumber, setValue] = useState('');
  const [secondformattedValue, setSecondFormattedValue] = useState('');
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  const [value, setPhoneValue] = useState('');

  const [formattedValue, setFormattedValue] = useState('');
  const [user, setUser] = useState(null);

  const title = route.params?.title;
  const bed = route.params?.bed;
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
  const locality = route.params?.locality;
  const sublocality = route.params?.sublocality;
  const address = route.params?.address;
  const currency = route.params?.currency;

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

  const goFaqs = () => {};

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContent}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <Image source={BackArrow} />
          </Pressable>
          <View style={styles.topButtons}>
            <Pressable
              style={styles.topButton}
              // eslint-disable-next-line react/jsx-no-bind
              onPress={async () => {
                await saveProgress({
                  type,
                  title,
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
                  phoneNumber: secondformattedValue,
                  // marketerNumber:
                  //   usersWithPrivileges.includes(user.uid) || user?.marketer_status === 'ACCEPTED'
                  //     ? formattedValue
                  //     : null,
                  locality,
                  sublocality,
                  currency,
                  address,
                });
                navigation.navigate('OnboardingScreen9', {
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
                  phoneNumber: secondformattedValue,
                  // marketerNumber:
                  //   usersWithPrivileges.includes(user.uid) || user?.marketer_status === 'ACCEPTED'
                  //     ? formattedValue
                  //     : null,
                  locality,
                  sublocality,
                  currency,
                  address,
                });
                const checkValid = phoneInput.current?.isValidNumber(value);
                const checkSecondValid = phoneInput.current?.isValidNumber(phoneNumber);
                // if (!checkSecondValid) {
                //   // Alert.alert('Your phone number is correct', secondformattedValue);
                //   await saveProgress({
                //     type,
                //     title,
                //     description,
                //     bed,
                //     bedroom,
                //     bathroom,
                //     imageUrls,
                //     homeprice,
                //     latitude,
                //     longitude,
                //     mode,
                //     amenities,
                //     phoneNumber: secondformattedValue,
                //     marketerNumber:
                //       usersWithPrivileges.includes(user.uid) || user?.marketer_status === 'ACCEPTED'
                //         ? formattedValue
                //         : null,
                //     locality,
                //     sublocality,
                //     currency,
                //     address,
                //   });
                //   navigation.navigate('OnboardingScreen9', {
                //     title,
                //     type,
                //     description,
                //     bed,
                //     bedroom,
                //     bathroom,
                //     imageUrls,
                //     homeprice,
                //     latitude,
                //     longitude,
                //     mode,
                //     amenities,
                //     phoneNumber: secondformattedValue,
                //     marketerNumber:
                //       usersWithPrivileges.includes(user.uid) || user?.marketer_status === 'ACCEPTED'
                //         ? formattedValue
                //         : null,
                //     locality,
                //     sublocality,
                //     currency,
                //     address,
                //   });
                // } else {
                //   Alert.alert('Your phone number is not correct', secondformattedValue);
                // }
              }}
            >
              <Typography style={styles.topButtonText}>Save & exit</Typography>
            </Pressable>
            <Pressable style={styles.topButton} onPress={goFaqs}>
              <Typography style={styles.topButtonText}>FAQs</Typography>
            </Pressable>
          </View>
        </View>
        <Typography style={styles.title} bold>
          What’s your phone number?
        </Typography>
        <Typography style={styles.titleText}>We will call to verify the number.</Typography>

        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="GH"
          layout="first"
          // eslint-disable-next-line react/jsx-no-bind
          onChangeText={text => {
            setValue(text);
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onChangeFormattedText={text => {
            setSecondFormattedValue(text);
          }}
          countryPickerProps={{withAlphaFilter: true}}
          withShadow
          autoFocus
          containerStyle={{borderRadius: 5, width: '100%'}}
          textContainerStyle={{backgroundColor: 'lightgrey'}}
        />
      </View>
      {usersWithPrivileges.includes(auth().currentUser.uid) ||
      user?.marketer_status === 'ACCEPTED' ? (
        <View style={{alignItems: 'center', padding: 20}}>
          <Text style={{fontWeight: 'bold', margin: 10}}>Add Marketer's Number</Text>
          <PhoneInput
            ref={phoneInput}
            defaultValue={value}
            defaultCode="GH"
            layout="first"
            // eslint-disable-next-line react/jsx-no-bind
            onChangeText={text => {
              setPhoneValue(text);
            }}
            // eslint-disable-next-line react/jsx-no-bind
            onChangeFormattedText={text => {
              setFormattedValue(text);
            }}
            countryPickerProps={{withAlphaFilter: true}}
            withShadow
            autoFocus
            containerStyle={{borderRadius: 5}}
            textContainerStyle={{backgroundColor: 'lightgrey'}}
          />
        </View>
      ) : null}
      <View
        style={{
          width: wp(100),
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <View style={{paddingHorizontal: offsets.offsetB}}>
          <DividedProgress total={4} progress={1} style={{marginBottom: offsets.offsetB}} />
        </View>
        <BottomActionsBar
          leftText="Back"
          rightText="Next"
          rightAction={async () => {
            if (!secondformattedValue) {
              alert('Please input your number');
              return;
            }
            navigation.navigate('OnboardingScreen9', {
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
              phoneNumber: secondformattedValue,
              marketerNumber:
                usersWithPrivileges.includes(user?.uid) || user?.marketer_status === 'ACCEPTED'
                  ? formattedValue
                  : null,
              locality,
              sublocality,
              currency,
              address,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen13;
