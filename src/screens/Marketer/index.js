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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../navigation/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {Marketer_Status, ROLE} from '../../variables';
import {
  Card,
  Layout,
  Icon,
  RangeCalendar,
  Text as Typography,
} from '@ui-kitten/components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {ActivityIndicator} from 'react-native';
import {Button} from '@ui-kitten/components';
import axios from 'axios';

const Marketer = () => {
  const {user, updateProfile} = useContext(AuthContext);
  const navigation = useNavigation();
  const [firebaseUser, setFirebaseUser] = useState();
  const profile = user?._user;

  const [posts, setPosts] = useState();
  const [range, setRange] = useState({});
  const [loading, setLoading] = useState(true);


  const handleFilter = async () => {
    try {
      const response = await axios.post(
        `https://www.rentit.homes/api/rentit/myhomes`,
        {
          id: user?.uid,
          startDate: range?.startDate,
          endDate: range?.endDate,
        },
      );
      setPosts(response?.data);
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
    fetchUserHome();
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
      infoText: `Your request has been submitted, once admin approves, enjoy the experience of Marketer in Rentit.`,
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

  return (
    <View style={styles.container}>
      {loading ? (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicator size="large" color="blue" />
  </View>
) : (
        <>
          <StatusBar hidden={true} />
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
            ]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Platform.OS === 'ios' ? 50 : 25,
                width: '100%',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                  Become a marketer
                </Text>
              </View>
            </View>
          </LinearGradient>

          {posts ? (
            <ScrollView style={{padding: 0, flex: 1}}>
              <View style={{marginTop: 20, margin: 20}}>
                <Text
                  style={{fontSize: 18, fontWeight: '600', paddingBottom: 15}}>
                  Why do you want to be a Marketer?
                </Text>
                <Text>
                  RentIt Marketers are at the core of the community of
                  homeowners we are building. You will work primarily in your
                  community to connect us with homeowners.
                </Text>
                <Typography
                  category="label"
                  style={{
                    marginTop: 10,
                    color: temp[firebaseUser?.marketer_status]?.color || 'blue',
                    alignSelf: 'center',
                  }}>
                  {temp[firebaseUser?.marketer_status]?.infoText ||
                    `You can request to admin to become a marketer, once admin approves, enjoy the experience of Marketer in Rentit.`}
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
                    }}>
                    <Button
                      disabled={!range?.startDate || !range?.endDate}
                      onPress={handleFilter}
                      appearance="outline">
                      Apply
                    </Button>
                    <Button
                      disabled={!range?.startDate || !range?.endDate}
                      onPress={() => {
                        setRange({});
                        fetchUserHome();
                      }}
                      appearance="outline">
                      Reset
                    </Button>
                  </Layout>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <CardComponent
                      icon={'home'}
                      label={'Total Homes'}
                      text={posts?.numberOfHomes || 0}
                      color="blue"
                    />
                    <CardComponent
                      icon={'money-symbol'}
                      label={'Total Earnings'}
                      text={`GH₵ ${posts?.earnings || 0}`}
                      color="blue"
                    />
                  </View>
                </View>
              )}
              <>
                {firebaseUser?.marketer_status !== 'ACCEPTED' && (
                  <Layout
                    level="1"
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}>
                    <Button
                      onPress={submitHandler}
                      disabled={
                        firebaseUser?.marketer_status ===
                          Marketer_Status.accepted ||
                        firebaseUser?.marketer_status ===
                          Marketer_Status.inReview
                      }
                      style={{width: 200, backgroundColor: 'blue', fontSize: 20, fontWeight:"bold"}}
                      appearance="filled">
                      {temp[firebaseUser?.marketer_status]?.buttonText ||
                        'Submit'}
                    </Button>
                  </Layout>
                )}
                <Layout
                  level="1"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    marginVertical: 10,
                  }}>
                  <Button
                    onPress={() => navigation.goBack()}
                    style={{width: 200, backgroundColor: 'white', fontSize: 20, fontWeight:"bold"}}
                    appearance="outline">
                    Go Back
                  </Button>
                </Layout>
              </>
            </ScrollView>
          ) : (
            <View style={{marginVertical: 100, alignItems: 'center'}}>
              <ActivityIndicator size={'large'} color="blue" />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: 'blue',
  },
  labelMargin: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    height: 40,
    marginBottom: 16,
    backgroundColor: '#DAE3F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'black',
  },
});

export default Marketer;

const CardComponent = ({color, text, icon, label}) => {
  return (
    <Card style={{margin: 2}} status="primary">
      <View style={{}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View style={{}}>
            <View
              style={{
                backgroundColor: 'rgba(44, 12, 201, 0.22)',
                padding: 10,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Fontisto name={icon} size={22} style={{color: color}} />
            </View>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginTop: 10,
              marginBottom: 5,
              fontFamily: 'Montserrat',
              fontSize: 16,
            }}>
            {text}
          </Text>
          <Text style={{fontFamily: 'Montserrat-Bold'}}>{label}</Text>
        </View>
      </View>
    </Card>
  );
};
