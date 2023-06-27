import React, {useContext, useEffect, useState} from 'react';
import {
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Card, Layout, Icon, RangeCalendar, Text as Typography, Button} from '@ui-kitten/components';
import Fontisto from 'react-native-vector-icons/Fontisto';

import axios from 'axios';
import {Marketer_Status, ROLE} from '../../variables';
import {AuthContext} from '../../navigation/AuthProvider';

const Marketer = () => {
  const {user, updateProfile} = useContext(AuthContext);
  const navigation = useNavigation();
  const [firebaseUser, setFirebaseUser] = useState();
  const profile = user?._user;
  const [totals, setTotals] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [posts, setPosts] = useState();
  const [range, setRange] = useState({});
  const [loading, setLoading] = useState(true);

  const handleFilter = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://qrt57zolm5ap6gtli3bgmgx4iu0tljlh.lambda-url.us-east-2.on.aws/',
        {
          userId: firebaseUser?.uid,
          startDate: range?.startDate,
          endDate: range?.endDate,
        },
      );
      setPosts(response?.data);
      setTotals(response?.data.totalSalary);
      console.log('Homes for user', response?.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserHome = async () => {
    try {
      const response = await axios.get(
        `https://www.rentit.homes/api/rentit/myhomes?id=${user?.uid}`,
      );
      setPosts(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // fetchUserHome();
    // console.log('Homes for user', posts);
  }, [user]);

  const getFirebaseUser = async () => {
    await firestore()
      .collection('users')
      .doc(user?._user?.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setFirebaseUser(documentSnapshot.data());
        }
        setLoading(false);
      });
  };

  const temp = {
    [Marketer_Status.inReview]: {
      infoText:
        'Your request has been submitted, once admin approves, enjoy the experience of Marketer in Rentit.',
      buttonText: 'In Review',
      color: 'orange',
    },
    [Marketer_Status.accepted]: {
      infoText: 'Your Marketer request has been approved successfully.',
      buttonText: 'Approved',
      color: 'green',
    },
    [Marketer_Status.decline]: {
      infoText: 'Your request has been declined',
      buttonText: 'Request Again',
      color: 'red',
    },
  };

  useEffect(() => {
    if (!user?._user?.uid) {
      return;
    }
    getFirebaseUser();
  }, [user?._user?.uid]);

  const submitHandler = async () => {
    await updateProfile({marketer_status: Marketer_Status.inReview});
    Alert.alert('Requested Successfully');
    navigation.navigate('Welcome');
  };
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading Salary...</Text>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <>
          <StatusBar hidden />
          <LinearGradient
            colors={['purple', 'deeppink']}
            start={{x: 0.1, y: 0.2}}
            end={{x: 1, y: 0.5}}
            style={[
              {
                backgroundColor: 'blue',
                height: '15%',
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 20,
                justifyContent: 'center',
              },
            ]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Platform.OS === 'ios' ? 50 : 25,
                width: '100%',
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#fff',
                    fontWeight: 'bold',
                  }}
                >
                  Become a marketer
                </Text>
              </View>
            </View>
          </LinearGradient>

          <ScrollView style={{padding: 0, flex: 1}}>
            <View style={{marginTop: 20, margin: 20}}>
              <Text style={{fontSize: 18, fontWeight: '600', paddingBottom: 15}}>
                Why do you want to be a Marketer?
              </Text>
              <Text>
                RentIt Marketers are at the core of the community of homeowners we are building. You
                will work primarily in your community to connect us with homeowners.
              </Text>
              <Typography
                category="label"
                style={{
                  marginTop: 10,
                  color: temp[firebaseUser?.marketer_status]?.color || 'blue',
                  alignSelf: 'center',
                }}
              >
                {temp[firebaseUser?.marketer_status]?.infoText ||
                  'You can request to admin to become a marketer, once admin approves, enjoy the experience of Marketer in Rentit.'}
              </Typography>
            </View>
            {firebaseUser?.marketer_status === 'ACCEPTED' && (
              <View style={{padding: 25}}>
                <RangeCalendar
                  range={range}
                  onSelect={nextRange => setRange(nextRange)}
                  min={new Date(2000, 0, 0)}
                  max={new Date(2050, 0, 0)}
                />
                <Layout
                  level="1"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    marginTop: 10,
                  }}
                >
                  <Button
                    disabled={!range?.startDate || !range?.endDate}
                    onPress={handleFilter}
                    appearance="outline"
                  >
                    Apply
                  </Button>
                  <Button
                    disabled={!range?.startDate || !range?.endDate}
                    onPress={() => {
                      setRange({});
                      handleFilter();
                    }}
                    appearance="outline"
                  >
                    Reset
                  </Button>
                </Layout>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <CardComponent
                    icon="home"
                    label="Total Homes"
                    text={posts?.numberOfHomes || 0}
                    color="blue"
                  />
                  <CardComponent
                    icon="money-symbol"
                    label="Total Earnings"
                    text={`GH₵ ${totals || 0}`}
                    color="blue"
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}
                >
                  <CardComponent
                    icon="check"
                    label="Available"
                    text={posts?.categories?.available || 0}
                    color="green"
                  />
                  <CardComponent
                    icon="close"
                    label="Unavailable"
                    text={posts?.categories?.unavailableLessThan30Days || 0}
                    color="red"
                  />
                </View>
              </View>
            )}
            <>
              {firebaseUser?.marketer_status !== 'ACCEPTED' && (
                <View style={{alignItems: 'center', marginTop: 20}}>
                  <Button
                    style={{
                      backgroundColor: temp[firebaseUser?.marketer_status]?.color || 'blue',
                      borderColor: temp[firebaseUser?.marketer_status]?.color || 'blue',
                      width: '60%',
                    }}
                    onPress={submitHandler}
                  >
                    {temp[firebaseUser?.marketer_status]?.buttonText || 'Request Now'}
                  </Button>
                </View>
              )}
            </>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const CardComponent = ({icon, label, text, color}) => (
  <Card
    style={{
      borderRadius: 10,
      width: '48%',
      backgroundColor: color,
      marginBottom: 10,
    }}
  >
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Fontisto name={icon} size={40} color="white" />
      <View style={{marginLeft: 10}}>
        <Text style={{color: 'white'}}>{label}</Text>
        <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{text}</Text>
      </View>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Marketer;
