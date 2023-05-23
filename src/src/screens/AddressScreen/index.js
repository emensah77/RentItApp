import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import Amplify, {API, graphqlOperation, Storage} from 'aws-amplify';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

import {Paystack, paystackProps} from 'react-native-paystack-webview';

import uuid from 'react-native-uuid';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {RangeCalendar} from '@ui-kitten/components';
import {createPaymentIntent} from '../../graphql/mutations';
import {AuthContext} from '../../navigation/AuthProvider';
import {convertDays, fCurrency} from '../../variables';
import useDwellTimeTracking from '../../hooks/useDwellTimeTracking';

const AddressScreen = props => {
  const {trackDwellTime} = useDwellTimeTracking();
  useEffect(trackDwellTime, [trackDwellTime]);
  const [range, setRange] = useState({});
  const {user, logout} = useContext(AuthContext);
  const [progressText, setProgressText] = useState(0);
  const [isLoading, setisLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState('');
  const [urls, setUrls] = useState([]);
  const [images, setImages] = useState([]);
  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const [modalvisible, setmodalvisible] = useState(false);
  const amount = route.params.price;
  const {homeimage} = route.params;
  const {homebed} = route.params;
  const {hometitle} = route.params;
  const {homelatitude} = route.params;
  const {homelongitude} = route.params;
  const {post} = route.params;
  const homeid = route.params.postid;
  const [homeprice, sethomeprice] = useState(1);
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // console.log(homebed);
  // console.log(homeimage);
  // console.log(hometitle);

  console.log(range);
  const noOfSelectedDays =
    (range?.endDate - range?.startDate) / (1000 * 60 * 60 * 24) + 1;

  const calculatePrice = () => {
    if (range?.endDate && range?.startDate) {
      const differenceInMilliseconds = range?.endDate - range?.startDate;
      const differenceInDays =
        differenceInMilliseconds / (1000 * 60 * 60 * 24) + 1;
      const calculatedPrice = Math.ceil(amount / 365) * differenceInDays;
      return calculatedPrice;
    }
    return 0;
  };

  const hellod1 = text => {
    setValue(parseInt(text));

    sethomeprice(value);
    console.log(value);
  };
  const helloTitle = text => {
    setTitle(text);
    console.log(title);
  };
  const helloDescrip = text => {
    setDescription(text);
    console.log(description);
  };

  const fetchResourceFromURI = async uri => {
    const response = await fetch(uri);
    // console.log(response);
    const blob = await response.blob();

    return blob;
  };

  const uploadResource = async image => {
    if (isLoading) return;
    setisLoading(true);
    const img = await fetchResourceFromURI(image.uri);
    setImageUrls(`https://d1mgzi0ytcdaf9.cloudfront.net/public/${image.name}`);

    return Storage.put(image.name, img, {
      level: 'public',
      contentType: 'image/jpeg',
      progressCallback(uploadProgress) {
        setProgressText((uploadProgress.loaded / uploadProgress.total) * 100);
        // setProgressText(

        //   `Progress: ${Math.round(
        //     (uploadProgress.loaded / uploadProgress.total) * 100,
        //   )} %`,
        // );
        // Alert.alert(`Uploading: ${Math.round(
        //     (uploadProgress.loaded / uploadProgress.total) * 100,
        //   )}%`);
      },
    })
      .then(res => {
        setisLoading(false);
        Storage.get(res.key, {
          level: 'public',
          contentType: 'image/jpeg',
        })
          .then(result => {
            console.log(urls);
          })
          .catch(err => {
            setProgressText('Upload Error');
            console.log(err);
          });
      })
      .catch(err => {
        setisLoading(false);
        setProgressText('Upload Error');
        console.log(err);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 1024,
      height: 683,
    }).then(image => {
      console.log(image);
      const img = {
        uri: image.path,
        type: image.mime,
        name: uuid.v4(),
      };
      uploadResource(img);

      setImages(prevImages => prevImages.concat(img));

      // image.map(item => {
      //     let img = {
      //         uri: item.sourceURL,
      //         type: item.mime,
      //         name: uuid.v4(),
      //         };
      //         uploadResource(img);

      //         setImages(prevImages => prevImages.concat(img));

      // })
    });
  };

  let rand;
  const addFinancingApplicant = () => {
    const randomString = (Math.random() * 1e32).toString(36).toUpperCase();
    rand = randomString;
    firestore()
      .collection('financingApplicants')
      .doc(rand)
      .set({
        userId: user.uid,
        imageID: imageUrls,
        income: value,
        fullName: title,
        phoneNumber: user.phoneNumber,
      })
      .then(docRef => {
        docRefId = docRef.id;
        docId = docRefId;
      })
      .catch(error => {
        console.log('Something went wrong adding to Loan Applicants', error);
      });
  };

  const submitFinancing = () => {
    if (Math.round((post.newPrice * 1.07) / 12) > Math.round((1 / 3) * value)) {
      Alert.alert("You don't qualify! Please try again another time");
    } else {
      addFinancingApplicant();
      Alert.alert(
        'Congratulations!! You qualify.',
        'Please call 0552618521 or 0201167537 to complete your application. Keep the application code: ' +
          `${rand}` +
          ' safe. We will ask you when you call us!',
      );
    }
  };
  useEffect(() => {
    if (imageUrls != '') {
      setUrls(prevImages => prevImages.concat(imageUrls));
    }
    console.log(urls);
  }, [imageUrls]);
  const [clientSecret, setClientSecret] = useState(null);

  if (isLoading) {
    return (
      <Modal
        transparent
        animationType="none"
        visible={isLoading}
        style={{zIndex: 1100}}
        onRequestClose={() => {}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              height: 150,
              width: 150,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Text style={{fontSize: 24, fontWeight: 'bold'}}>Uploading...</Text>

            <ActivityIndicator
              animating
              size="large"
              color="blue"
              style={{opacity: 1}}
            />
          </View>
        </View>
      </Modal>
    );
  }

  // useEffect(() => {
  //   fetchPaymentIntent();
  // }, []);

  // useEffect(() => {
  //   if (clientSecret) {
  //     initializePaymentSheet();
  //   }
  // }, [clientSecret !== null]);

  // const fetchPaymentIntent = async () => {
  //   const response = await API.graphql(
  //     graphqlOperation(createPaymentIntent, {amount}),
  //   );
  //   setClientSecret(response.data.createPaymentIntent.clientSecret);
  // };

  // const initializePaymentSheet = async () => {
  //   if (!clientSecret) {
  //     return;
  //   }
  //   const {error} = await initPaymentSheet({
  //     paymentIntentClientSecret: clientSecret,
  //   });
  //   console.log('success');
  //   if (error) {
  //     Alert.alert(error);
  //   }
  // };

  // const openPaymentSheet = async () => {
  //   if (!clientSecret) {
  //     return;
  //   }
  //   const {error} = await presentPaymentSheet({clientSecret});

  //   if (error) {
  //     Alert.alert(`Error code: ${error.code}`, error.message);
  //   } else {

  //     Alert.alert('Success', 'Your payment is confirmed!');
  //   }
  // };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
      <Modal
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'white',
          padding: 20,
        }}
        animationType="slide"
        transparent={false}
        visible={modalvisible}
        onRequestClose={() => {
          navigation.goBack();
          console.log('Modal has been closed.');
        }}>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <View>
              <Pressable
                onPress={() => navigation.goBack()}
                style={{margin: 10}}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} />
              </Pressable>

              <Text
                style={{fontWeight: 'bold', paddingBottom: 5, marginLeft: 10}}>
                Ready to Apply?
              </Text>
              <Text style={{fontWeight: 'normal', marginLeft: 10}}>
                Enter your contact details and we will let you know if you
                qualify
              </Text>
            </View>

            <Pressable
              onPress={() => openCamera()}
              style={{
                backgroundColor: 'blue',
                borderRadius: 5,
                alignSelf: 'center',
                width: 250,
                height: 35,
              }}>
              <Text
                style={{
                  marginVertical: 5,
                  alignSelf: 'center',
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                Take a picture of your ID Card
              </Text>
            </Pressable>

            <View style={{padding: 10}}>
              <Text style={{fontWeight: 'bold', padding: 5}}>Full Name</Text>
              <TextInput
                adjustsFontSizeToFit
                placeholder="This should be the same name as on your ID Card"
                multiline
                maxLength={50}
                onChangeText={text => helloTitle(text)}
                style={{
                  alignContent: 'flex-start',
                  width: '100%',
                  height: 40,
                  fontSize: 12,
                  fontWeight: 'bold',
                  borderWidth: 1,
                  borderColor: 'darkgray',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            <View style={{padding: 10}}>
              <Text style={{fontWeight: 'bold', padding: 5}}>
                Monthly Income
              </Text>
              <TextInput
                adjustsFontSizeToFit
                keyboardType="numeric"
                placeholder="How much money do you make from your job every month?"
                multiline
                maxLength={50}
                onChangeText={text => hellod1(text)}
                style={{
                  alignContent: 'flex-start',
                  width: '100%',
                  height: 40,
                  fontSize: 12,
                  fontWeight: 'bold',
                  borderWidth: 1,
                  borderColor: 'darkgray',
                  borderRadius: 10,
                  padding: 10,
                }}
              />
            </View>

            <TouchableOpacity
              disabled={!!(value === '' || title === '' || urls.length === 0)}
              onPress={() => submitFinancing()}
              style={{
                opacity:
                  value === '' || title === '' || urls.length === 0 ? 0.5 : 1,
                height: 40,
                margin: 20,
                borderRadius: 10,
                alignItems: 'center',
                backgroundColor: 'black',
              }}>
              <Text style={{paddingTop: 10, color: 'white'}}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      <View style={styles.innerContainer}>
        <FastImage
          style={styles.image}
          source={{
            uri: homeimage,
            headers: {Authorization: 'token'},
            priority: FastImage.priority.high,
          }}
        />

        <View style={{flex: 1, marginHorizontal: 10, marginBottom: 10}}>
          <Text style={{fontFamily: 'Montserrat-Bold'}}>{hometitle}</Text>
          <Text style={{fontFamily: 'Montserrat-Regular'}}>
            {homebed} bedroom
          </Text>
        </View>
      </View>
      <View style={styles.hairline} />
      <View>
        <Text
          style={{
            marginBottom: 10,
            fontFamily: 'Montserrat-Bold',
            alignSelf: 'center',
          }}>
          Your Rent Details
        </Text>
        <Text style={{marginBottom: 10, fontFamily: 'Montserrat'}}>
          Select the dates from calendar
        </Text>
      </View>

      {/* <View style={styles.row}>
                <View style={{flex:1, justifyContent:'space-between'}}>
                    <Text style={{fontWeight: 'bold'}}>Years</Text>
                    <Text style={{color: 'darkgray'}}>How many years?</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems:'center'}}>

                    <Pressable
                    onPress={() => setYears(Math.max(0, years - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>

                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{years}</Text>

                    <Pressable onPress={() => setYears (years + 1)}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>+</Text>

                    </Pressable>
                </View>

            </View> */}

      <RangeCalendar
        range={range}
        onSelect={nextRange => setRange(nextRange)}
      />
      {/* <View style={styles.row}>
                <View style={{flex:1, justifyContent:'space-between'}}>
                    <Text style={{fontWeight: 'bold'}}>Months</Text>
                    <Text style={{color: 'darkgray'}}>How many months?</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems:'center'}}>

                    <Pressable
                    onPress={() => setMonths(Math.max(0, months - 1))}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>-</Text>

                    </Pressable>

                    <Text style={{marginHorizontal: 20, fontSize: 20}}>{months}</Text>

                    <Pressable onPress={() => setMonths (months + 1)}
                    style = {styles.button}
                    >
                        <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                    </Pressable>
                </View>

            </View> */}

      {/* <View style={styles.hairline}/>
            <View>
            <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Choose how to pay</Text>

            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={{marginLeft:10}}>RentIt Financing</Text>
                <Pressable onPress={() => setmodalvisible(true)} style={{backgroundColor:"deeppink", padding:2, borderRadius:2 ,marginHorizontal:50}}>
                    <Text style={{color:"white"}}>Apply Now</Text>
                </Pressable>
            </View>

            <View style={styles.hairline}/>
            <View>
            <Text style={{marginBottom: 10, fontFamily:'Montserrat-Bold'}}>Price Details</Text>
            </View> */}

      <View
        style={{
          margin: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{padding: 20, flex: 1}}>
          {/* <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Years</Text> */}
          <Text style={{paddingBottom: 10, fontFamily: 'Montserrat-Regular'}}>
            Months
          </Text>
          <Text style={{paddingBottom: 10, fontFamily: 'Montserrat-Regular'}}>
            Weeks
          </Text>
          <Text style={{paddingBottom: 10, fontFamily: 'Montserrat-Regular'}}>
            Days
          </Text>
          <Text style={{paddingBottom: 10, fontFamily: 'Montserrat-Bold'}}>
            Total
          </Text>
          {/* <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Service Fee</Text> */}
          {/* <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>Total</Text> */}
        </View>
        <View style={{padding: 20, alignSelf: 'center'}}>
          {/* <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>{years}</Text>
            <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>{months}</Text> */}
          <Text
            style={{
              paddingBottom: 10,
              fontFamily: 'Montserrat-Regular',
              alignSelf: 'center',
            }}>
            {noOfSelectedDays > 0 ? convertDays(noOfSelectedDays).months : '0'}
          </Text>
          <Text
            style={{
              paddingBottom: 10,
              fontFamily: 'Montserrat-Regular',
              alignSelf: 'center',
            }}>
            {noOfSelectedDays > 0 ? convertDays(noOfSelectedDays).weeks : '0'}
          </Text>
          <Text
            style={{
              paddingBottom: 10,
              fontFamily: 'Montserrat-Regular',
              alignSelf: 'center',
            }}>
            {noOfSelectedDays > 0 ? convertDays(noOfSelectedDays).days : '0'}
          </Text>
          <Text
            style={{
              paddingBottom: 10,
              fontFamily: 'Montserrat-Bold',
              alignSelf: 'center',
            }}>
            {post.currency === null
              ? 'GH₵'
              : post.currency[0] === 'usd'
              ? '$'
              : 'GH₵'}

            {/* {(Math.round(amount*(years+(months/12)))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
            {fCurrency(calculatePrice())}
          </Text>

          {/* <Text style={{paddingBottom:10, fontFamily:'Montserrat-Regular'}}>GH₵{amount*(years+(months/12))*.07}</Text> */}
        </View>
      </View>

      <View style={styles.hairline} />

      <View style={{flex: 1}}>
        <Text style={{marginBottom: 10, fontFamily: 'Montserrat-Bold'}}>
          Cancellation Policy
        </Text>
      </View>
      <View style={{margin: 15, alignSelf: 'flex-start'}}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
          }}>
          Free cancellation before you move in to the house. Once you move in,
          cancel and get a refund , minus the number of days you have already
          stayed in the house.
        </Text>
      </View>

      <View style={styles.hairline} />
      <TouchableOpacity
        style={{
          marginBottom: 10,
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
          height: 45,
          width: Dimensions.get('screen').width - 150,
          marginHorizontal: 20,
          borderRadius: 10,
        }}
        onPress={() =>
          navigation.navigate('Payment', {
            channel: ['mobile_money'],
            // totalAmount: Math.round(amount*(years+(months/12))),
            totalAmount: calculatePrice(),
            homeimage,
            homelatitude,
            homelongitude,
            hometitle,
            homebed,
            homeid,
            homeyears: years,
            homeMonths:
              noOfSelectedDays > 0
                ? convertDays(noOfSelectedDays).months
                : null,
            homeWeeks:
              noOfSelectedDays > 0 ? convertDays(noOfSelectedDays).weeks : null,
            homeDays:
              noOfSelectedDays > 0
                ? convertDays(noOfSelectedDays).months
                : null,
          })
        }>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            color: 'white',
          }}>
          Pay with Mobile Money
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginBottom: 10,
          backgroundColor: 'deeppink',
          alignItems: 'center',
          justifyContent: 'center',
          height: 45,
          width: Dimensions.get('screen').width - 150,
          marginHorizontal: 20,
          borderRadius: 10,
        }}
        onPress={() =>
          navigation.navigate('Payment', {
            channel: ['card'],
            // totalAmount: Math.round(amount*(years+(months/12))),
            totalAmount: calculatePrice(),
            homeimage,
            homelatitude,
            homelongitude,
            hometitle,
            homebed,
            homeid,
            homeyears: years,
            homeMonths:
              noOfSelectedDays > 0
                ? convertDays(noOfSelectedDays).months
                : null,
            homeWeeks:
              noOfSelectedDays > 0 ? convertDays(noOfSelectedDays).weeks : null,
            homeDays:
              noOfSelectedDays > 0
                ? convertDays(noOfSelectedDays).months
                : null,
          })
        }>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            color: 'white',
          }}>
          Pay with ATM Card
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  image: {
    height: '50%',
    width: '50%',
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    margin: 20,
    marginBottom: 20,
  },
  hairline: {
    alignSelf: 'stretch',
    borderBottomWidth: 10,
    borderBottomColor: 'lightgrey',
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'darkgray',
    marginHorizontal: 20,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: 'darkgray',
    marginHorizontal: 20,
  },
  button: {
    borderWidth: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    borderColor: 'darkgray',
    alignItems: 'center',
  },
});
