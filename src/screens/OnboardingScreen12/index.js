import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {faCrown, faHandshake, faCouch, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const OnboardingScreen12 = props => {
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

  const handleLoyaltyPress = () => {
    setLoyalty(!loyalty);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.log('Selected date:', date);
    // Save the selected date here
    setAvailabilityDate(date);
    hideDatePicker();
  };

  const handleAvailableForRent = value => {
    setAvailableForRent(value);
    if (!value) {
      showDatePicker();
    }
  };

  const handleNegotiablePress = () => {
    setNegotiable(!negotiable);
  };

  const handleFurnishedPress = () => {
    setFurnished(!furnished);
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

    navigation.navigate('OnboardingScreen13', {
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
    } catch (error) {
      console.log(error);
    }
  };
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
  useEffect(() => {
    userDetails();
    getUsersWithPrivileges();
    return () => {};
  }, [user]);

  return (
    <LinearGradient
      colors={['blue', 'deeppink']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      <StatusBar hidden />
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.text_header}>Choose options</Text>
      </View>
      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}>
        <ScrollView>
          {usersWithPrivileges.includes(auth().currentUser.uid) ||
          user?.marketer_status === 'ACCEPTED' ? (
            <TouchableOpacity
              style={[styles.optionButton, loyalty && styles.selectedOptionButton]}
              onPress={handleLoyaltyPress}>
              <FontAwesomeIcon icon={faCrown} style={styles.optionIcon} color="blue" />
              <View>
                <Text style={styles.optionButtonText}>Loyalty Home</Text>
                <Text style={styles.optionDescription}>
                  You have given a loyalty package to this homeowner
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.optionButton, negotiable && styles.selectedOptionButton]}
            onPress={handleNegotiablePress}>
            <FontAwesomeIcon icon={faHandshake} style={styles.optionIcon} color="blue" />
            <View>
              <Text style={styles.optionButtonText}>Negotiable</Text>
              <Text style={styles.optionDescription}>Price can be negotiated with homeowner</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, furnished && styles.selectedOptionButton]}
            onPress={handleFurnishedPress}>
            <FontAwesomeIcon icon={faCouch} style={styles.optionIcon} color="blue" />
            <View>
              <Text style={styles.optionButtonText}>Furnished</Text>
              <Text style={styles.optionDescription}>
                Property comes with furniture and amenities
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.homeownerNameContainer}>
            <Text style={styles.homeownerNameText}>Enter the homeowner's name</Text>
            <TextInput
              style={styles.homeownerNameInput}
              onChangeText={text => setHomeownerName(text)}
              value={homeownerName}
              placeholder="Homeowner's Name"
            />
          </View>

          <View style={styles.availableForRentContainer}>
            <Text style={styles.availableForRentText}>Is your home available for rent now?</Text>
            <View style={styles.availableForRentButtons}>
              <TouchableOpacity
                style={[
                  styles.availableForRentButton,
                  availableForRent === true && styles.selectedAvailableForRentButton,
                ]}
                onPress={() => handleAvailableForRent(true)}>
                <Text style={styles.availableForRentButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.availableForRentButton,
                  availableForRent === false && styles.selectedAvailableForRentButton,
                ]}
                onPress={() => handleAvailableForRent(false)}>
                <Text style={styles.availableForRentButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            customHeaderIOS={() => (
              <View style={styles.customHeader}>
                <Text style={styles.customHeaderText}>Select when your home will be available</Text>
              </View>
            )}
            customHeaderAndroid={() => (
              <View style={styles.customHeader}>
                <Text style={styles.customHeaderText}>Select when your home will be available</Text>
              </View>
            )}
          />

          <TouchableOpacity
            style={[
              styles.nextButton,
              homeownerName && availableForRent !== null ? null : styles.disabledNextButton,
            ]}
            onPress={handleNextPress}
            disabled={!homeownerName || availableForRent === null}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'left',
    top: 80,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 1,
    zIndex: 999,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectedOptionButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgray',
  },
  optionIcon: {
    color: '#1e90ff',
    marginRight: 20,
    fontSize: 25,
  },
  optionButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  optionDescription: {
    color: 'gray',
    marginTop: 5,
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: 'deeppink',
    borderRadius: 30,
    paddingVertical: 15,
    marginTop: 30,
  },
  disabledNextButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  availableForRentContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  availableForRentText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
  },
  availableForRentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  availableForRentButton: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'lightgray',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexGrow: 1,
    marginRight: 10,
  },
  selectedAvailableForRentButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'lightgray',
  },
  availableForRentButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  datePickerHeader: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  datePickerHeaderText: {
    fontSize: 18,
    textAlign: 'center',
  },
  customHeader: {
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  customHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeownerNameContainer: {
    flexDirection: 'column',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeownerNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  homeownerNameInput: {
    marginTop: 10,
    width: '90%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

export default OnboardingScreen12;
