import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Fontisto from "react-native-vector-icons/Fontisto";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import {useNavigation, useRoute} from "@react-navigation/native";
import {
  faCrown,
  faHandshake,
  faCouch,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';

const OnboardingScreen12 = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loyalty, setLoyalty] = useState(false);
  const [negotiable, setNegotiable] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [user, setUser] = useState(null);
  const [usersWithPrivileges, setUsersWithPrivileges] = useState([]);
  const bed = route.params?.bed;
  const title = route.params?.title
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
  const sublocality =  route.params?.sublocality;
  const address =  route.params?.address;
  const currency = route.params?.currency;
  const marketerNumber = route.params?.marketerNumber;
  const handleLoyaltyPress = () => {
    setLoyalty(!loyalty);
  };

  const handleNegotiablePress = () => {
    setNegotiable(!negotiable);
  };

  const handleFurnishedPress = () => {
    setFurnished(!furnished);
  };

  const handleNextPress = async () => {
    await saveProgress({title: title, type: type, description: description,
       bed: bed, bedroom: bedroom, bathroom: bathroom, imageUrls: imageUrls,
        homeprice: homeprice, latitude: latitude,
       longitude: longitude, mode: mode, amenities: amenities,
        phoneNumber: phoneNumber, marketerNumber: marketerNumber,
         locality: locality, sublocality: sublocality, currency: currency, 
         negotiable: negotiable ? "Yes" : "No", loyaltyProgram: loyalty ? "Yes" : "No", 
         furnished: furnished  ? "Yes" : "No", address: address,})

      navigation.navigate('OnboardingScreen13', {
        title: title,
        type: type,
        description: description,
        bed: bed,
        bedroom: bedroom,
        bathroom: bathroom,
        imageUrls: imageUrls,
        homeprice: homeprice,
        latitude: latitude,
        longitude: longitude,
        mode: mode,
        amenities: amenities,
        phoneNumber: phoneNumber,
        marketerNumber: marketerNumber,
        locality: locality,
        sublocality: sublocality,
        currency: currency,
        negotiable: negotiable ? "Yes" : "No",
        loyaltyProgram: loyalty ? "Yes" : "No",
        furnished: furnished  ? "Yes" : "No",
        address: address,
       
    });
  };
  const userDetails = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      if (userDoc.exists) {
        setUser(userDoc.data());
        //console.log('User data:', user);
        // Do something with user data
      }
    }
  };
  const getUsersWithPrivileges = async () => {
    try {
      const callers = await firestore().collection('usersWithPrivileges');
      callers.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUsersWithPrivileges(prev => [...prev, doc.data().userId])
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  const saveProgress = async (progressData) => {
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
            progressData
          }
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
      start={{ x: 0.1, y: 0.2 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      <StatusBar hidden={true} />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Fontisto name="angle-left" size={25}  style={{color:'white', margin:20, marginTop:30}}/> 
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.text_header}>Choose options</Text>
      </View>
      <Animatable.View
        useNativeDriver={true}
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <ScrollView>
        {
            usersWithPrivileges.includes(auth().currentUser.uid) || user?.marketer_status === "ACCEPTED" ?
          <TouchableOpacity
            style={[
              styles.optionButton,
              loyalty && styles.selectedOptionButton,
            ]}
            onPress={handleLoyaltyPress}
          >
            <FontAwesomeIcon
              icon={faCrown}
              style={styles.optionIcon}
              color="blue"
            />
            <View>
              <Text style={styles.optionButtonText}>Loyalty Home</Text>
              <Text style={styles.optionDescription}>
                You have given a loyalty package to this homeowner
              </Text>
            </View>
          </TouchableOpacity>
            : null}

          <TouchableOpacity
            style={[
              styles.optionButton,
              negotiable && styles.selectedOptionButton,
            ]}
            onPress={handleNegotiablePress}
          >
            <FontAwesomeIcon
              icon={faHandshake}
              style={styles.optionIcon}
              color="blue"
            />
            <View>
              <Text style={styles.optionButtonText}>Negotiable</Text>
              <Text style={styles.optionDescription}>
                Price can be negotiated with homeowner
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              furnished && styles.selectedOptionButton,
            ]}
            onPress={handleFurnishedPress}
          >
            <FontAwesomeIcon
              icon={faCouch}
              style={styles.optionIcon}
              color="blue"
            />
            <View>
              <Text style={styles.optionButtonText}>Furnished</Text>
              <Text style={styles.optionDescription}>
                Property comes with furniture and amenities
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              (loyalty || negotiable || furnished)
                ? null
                : styles.disabledNextButton
            ]}
            onPress={handleNextPress}
            //disabled={!loyalty && !negotiable && !furnished}
          >
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
top:80
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
borderWidth: .5,
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
},
nextButton: {
backgroundColor: 'deeppink',
borderRadius: 30,
paddingVertical: 15,
marginTop: 30,
},
disabledNextButton: {
opacity: 1,
},
nextButtonText: {
color: 'white',
fontWeight: 'bold',
fontSize: 20,
textAlign: 'center',
},
});

export default OnboardingScreen12;

    