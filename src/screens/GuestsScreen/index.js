import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Pressable,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Text,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {AuthContext} from '../../navigation/AuthProvider.js';
import mixpanel from '../../MixpanelConfig.js';
import useDwellTimeTracking from '../../hooks/useDwellTimeTracking';
import styles from './styles.js';

const GuestsScreen = props => {
  const navigation = useNavigation();
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rooms, setrooms] = useState(0);
  const route = useRoute();
  const {user} = useContext(AuthContext);
  const [priceRange, setPriceRange] = useState([1, 500]);
  const [moveInDate, setMoveInDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const hometype = route.params?.hometype;
  const [daysDifference, setDaysDifference] = useState(0);

  const {trackDwellTime} = useDwellTimeTracking();
  useEffect(trackDwellTime, [trackDwellTime]);

  const calculateDaysDifference = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || moveInDate;
    setShowDatePicker(Platform.OS === 'ios');
    setMoveInDate(currentDate);
    setDateSelected(true);
    // Calculate the difference between the selected date and the current date
    setDaysDifference(calculateDaysDifference(currentDate, new Date()));
    console.log('Days difference:', daysDifference);
  };
  return (
    <LinearGradient
      colors={['#009245', '#FCEE21']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}>
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </Pressable>

      <View style={styles.header} />
      <Text style={styles.text_header}> How many {'\n'} people and rooms? </Text>

      <View style={{justifyContent: 'space-between', height: '100%'}}>
        <Animatable.View animation="fadeInUpBig" duration={50} style={styles.footer}>
          <ScrollView
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}>
            <View>
              {/* <View style={styles.row}>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Adults</Text>
                            <Text style={{ color: 'darkgray' }}>Ages 13 or above</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                onPress={() => setAdults(Math.max(0, adults - 1))}
                                style={styles.button}>
                                <Text style={{ fontSize: 20, color: 'black' }}>-</Text>
                            </Pressable>

                            <Text style={{ marginHorizontal: 20, fontSize: 20 }}>{adults}</Text>

                            <Pressable
                                onPress={() => setAdults(adults + 1)}
                                style={styles.button}>
                                <Text style={{ fontSize: 20, color: 'black' }}>+</Text>
                            </Pressable>
                        </View>
                    </View> */}

              {/* <View style={styles.row}>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Children</Text>
                            <Text style={{ color: 'darkgray' }}>2 - 12</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Pressable
                                onPress={() => setChildren(Math.max(0, children - 1))}
                                style={styles.button}>
                                <Text style={{ fontSize: 20, color: 'black' }}>-</Text>
                            </Pressable>

                            <Text style={{ marginHorizontal: 20, fontSize: 20 }}>
                                {children}
                            </Text>

                            <Pressable
                                onPress={() => setChildren(children + 1)}
                                style={styles.button}>
                                <Text style={{ fontSize: 20, color: 'black' }}>+</Text>
                            </Pressable>
                        </View>
                    </View> */}

              <View style={styles.row}>
                <View>
                  <Text style={{fontWeight: 'bold'}}>Rooms</Text>
                  <Text style={{color: 'darkgray'}}>Number of Rooms</Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Pressable onPress={() => setrooms(Math.max(0, rooms - 1))} style={styles.button}>
                    <Text style={{fontSize: 20, color: 'black'}}>-</Text>
                  </Pressable>

                  <Text style={{marginHorizontal: 20, fontSize: 20}}>{rooms}</Text>

                  <Pressable onPress={() => setrooms(rooms + 1)} style={styles.button}>
                    <Text style={{fontSize: 20, color: 'black'}}>+</Text>
                  </Pressable>
                </View>
              </View>
              {/* Price Range */}
              <View style={styles.row}>
                <View style={{marginHorizontal: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Price Range</Text>
                  <Text style={{color: 'darkgray'}}>
                    {priceRange[0]} -{priceRange[1]}
                  </Text>
                </View>
                <View style={{paddingHorizontal: 10, marginHorizontal: 10}}>
                  <MultiSlider
                    min={0}
                    max={100000}
                    values={priceRange}
                    onValuesChange={setPriceRange}
                    sliderLength={200}
                    step={100}
                    style={{color: 'blue'}}
                    customMarker={() => (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 15,
                          backgroundColor: 'blue',
                          borderWidth: 3,
                          borderColor: 'white',
                          margin: 30,
                        }}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Move-in Date */}
              <View style={styles.row}>
                <View>
                  <Text style={{fontWeight: 'bold'}}>Move-in Date</Text>
                  <Text style={{color: 'darkgray'}}>Select the date you want to move in</Text>
                </View>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  {dateSelected ? (
                    <Text style={{color: 'blue'}}>{moveInDate.toLocaleDateString()}</Text>
                  ) : (
                    <Text style={{color: 'blue'}}>Select Date</Text>
                  )}
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={moveInDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
              {/* <ScrollView style={{marginHorizontal:10}} scrollEnabled={true}>
      <MultiSlider

        min={1}
        max={1000000}
        onValuesChangeStart={() => console.log('ok')}
        onValuesChangeFinish={() => console.log('ok')}
      />
    </ScrollView>  */}

              <Pressable
                onPress={async () => {
                  navigation.navigate('Home', {
                    screen: 'Explore',
                    params: {
                      screen: 'SearchResults',
                      params: {
                        guests: rooms,
                        viewport: route.params.viewport,
                        priceRange,
                        moveInDate: daysDifference,
                        hometype,
                      },
                    },
                  });
                  // adding the search result to the firebase
                  // console.log("=========>", route.params.location.address_components?.[0]?.long_name)
                  const fcmToken = await AsyncStorage.getItem('fcmToken');
                  // console.log('=====> FCM', fcmToken)
                  if (user?.uid) {
                    try {
                      await firestore()
                        .collection('searchQuery')
                        .doc(
                          `${user.uid}-${route.params.location.address_components?.[0]?.long_name}`,
                        )
                        .set({
                          place: route.params.location.address_components?.[0]?.long_name, // send the locality of place to save it on firebase searchQuery
                          userId: user.uid,
                          guests: rooms,
                          created_at: new Date(),
                          userFcm: fcmToken,
                          priceRange,
                          moveInDate: daysDifference,
                          hometype,
                        });
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }}
                style={{
                  // marginTop: Platform.OS === 'android' ? Dimensions.get('window').height/8 : Dimensions.get('window').height/5,
                  backgroundColor: 'blue',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  marginHorizontal: 20,
                  borderRadius: 25,
                  marginBottom: 60,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    fontWeight: 'bold',
                  }}>
                  Search
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
};

export default GuestsScreen;
