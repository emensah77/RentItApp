import React, { useContext, useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore'
import { Marketer_Status, ROLE } from '../../variables';

const Marketer = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigation = useNavigation();
    const [firebaseUser, setFirebaseUser] = useState();
    const profile = user?._user

    const getFirebaseUser = async () => {
        await firestore().collection('users')
            .doc(user?._user?.uid).get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    setFirebaseUser(documentSnapshot.data());
                }
            })
    }

    const temp = {
        [Marketer_Status.inReview]: {
            infoText: `Your request has been submitted, once admin approves, enjoy the experience of Marketer in Rentit.`, buttonText: 'In Review', color: 'orange'
        },
        [Marketer_Status.accepted]: { infoText: 'Your Marketer request has been approved successfully.', buttonText: 'Approved', color: 'green' },
        [Marketer_Status.decline]: { infoText: 'Your request has been declined', buttonText: 'Request Again', color: 'red' },
    }

    useEffect(() => {
        if (!user?._user?.uid) {
            return
        }
        getFirebaseUser()
    }, [user?._user?.uid])

    const submitHandler = async () => {
        await updateProfile({ role: ROLE.user, marketer_status: Marketer_Status.inReview })
        Alert.alert(
            "Requested Successfully"
        )
        navigation.navigate('Welcome')
    }



    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <LinearGradient
                colors={['purple', 'deeppink']}
                start={{ x: 0.1, y: 0.2 }}
                end={{ x: 1, y: 0.5 }}
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
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: Platform.OS === 'ios' ? 50 : 25,
                    width: '100%'
                }}>
                    <View
                        style={{
                            // width: '50%'
                        }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: "#fff",
                                fontWeight: 'bold'
                            }}>Become a marketer</Text>
                    </View>
                </View>
            </LinearGradient>

            <View style={{ padding: 0, flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom:50}}
                >
                    <View style={{ marginTop: 20, margin: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', paddingBottom: 15 }}>Why do you want to be a Marketer?</Text>
                        <Text>
                            RentIt Marketers are at the core of the community
                            of homeowners we are building. You will work
                            primarily in your community to connect us with homeowners.
                        </Text>
                        <Text style={{ marginTop: 10, color: temp[firebaseUser?.marketer_status]?.color || 'blue' }}>{temp[firebaseUser?.marketer_status]?.infoText || `You can request to admin to become a marketer, once admin approves, enjoy the experience of Marketer in Rentit.`}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={submitHandler}
                        disabled={firebaseUser?.marketer_status === Marketer_Status.accepted
                            || firebaseUser?.marketer_status === Marketer_Status.inReview}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'blue',
                            width: '50%',
                            height: '20%',
                            backgroundColor: 'blue',
                            borderRadius: 10,
                            alignSelf: 'center'
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'Montserrat-Bold',
                                color: 'white',
                            }}>
                            {temp[firebaseUser?.marketer_status]?.buttonText || 'Submit'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'blue',
                            width: '50%',
                            height: '20%',
                            borderRadius: 10,
                            alignSelf: 'center',
                            marginTop: 10
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'Montserrat-Bold',
                                color: 'blue',
                            }}> Go Back
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
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
        fontWeight: "600",
        color: "blue",
    },
    labelMargin: {
        marginTop: 24,
        marginBottom: 8,
        fontSize: 12,
        fontWeight: "400",
    },
    input: {
        height: 40,
        marginBottom: 16,
        backgroundColor: "#DAE3F0",
        borderRadius: 8,
        paddingHorizontal: 12,
        color: 'black'
    },
});

export default Marketer;
