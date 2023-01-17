import React, { useContext, useEffect, useState } from 'react';
import {
    StatusBar,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    ScrollView,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../navigation/AuthProvider';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';

const ManageProfile = () => {
    const { user, updateProfile } = useContext(AuthContext);
    const navigation = useNavigation();
    const [firebaseUser, setFirebaseUser] = useState();
    const profile = user?._user
    const [name, setName] = useState(profile?.displayName)
    const [email, setEmail] = useState(profile?.email)
    const [phone, setPhone] = useState(firebaseUser?.phoneNumber)

    const getFirebaseUser = async () => {
        await firestore().collection('users')
            .doc(user?._user?.uid).get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    // console.log('User Data', documentSnapshot.data());
                    setFirebaseUser(documentSnapshot.data());
                }
            })
    }

    useEffect(() => {
        if (!user?._user?.uid) {
            return
        }
        getFirebaseUser()
    }, [user?._user?.uid])

    const submitHandler = async () => {
        if (!name) {
            Alert.alert("Enter Name");
            return
        }
        await updateProfile({ displayName: name, email, phoneNumber: phone })
        Alert.alert(
            "Profile Updated"
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
                        height: '25%',
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
                            width: '50%'
                        }}>
                        <Text
                            style={{
                                fontSize: 24,
                                color: "#fff",
                                fontWeight: 'bold'
                            }}>{profile?.displayName}</Text>

                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Image
                            source={{ uri: user ? profile?.photoURL || 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg' }}
                            style={{
                                height: 100,
                                width: 100,
                                borderRadius: 50,

                            }}
                        />
                    </View>
                </View>
            </LinearGradient>

            <View style={{ padding: 15, flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={{ ...styles.label, marginTop: 10 }}>Display Name</Text>
                    <TextInput
                        value={name}
                        style={styles.input}
                        editable={true}
                        onChangeText={(text) => setName(text)}
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        value={email}
                        style={[styles.input, { color: 'gray' }]}
                        editable={false}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <Text style={styles.label}>Role</Text>
                    <TextInput
                        value={firebaseUser?.role || 'USER'}
                        style={[styles.input, { color: 'gray' }]}
                        editable={false}
                    />
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        value={phone || firebaseUser?.phoneNumber}
                        style={[styles.input, { color: 'gray' }]}
                        editable={false}
                        onChangeText={(text) => setPhone(text)}
                        keyboardType='numeric'
                    />
                    <TouchableOpacity
                        onPress={submitHandler}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'blue',
                            width: '40%',
                            height: '12%',
                            backgroundColor: 'blue',
                            borderRadius: 10,
                            alignSelf: 'center',
                            flex:1
                        }}>
                        <Text
                            style={{
                                fontSize: 16,
                                fontFamily: 'Montserrat-Bold',
                                color: 'white',
                            }}>
                            Submit
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

export default ManageProfile;
