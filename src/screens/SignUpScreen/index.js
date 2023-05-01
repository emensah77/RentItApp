import React, {useContext, useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import SocialButton from '../../components/SocialButton';
import {AuthContext} from '../../navigation/AuthProvider';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const {register} = useContext(AuthContext);

  const onChange = useCallback(
    type => value => {
      switch (type) {
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'confirm-password':
          setConfirmPassword(value);
          break;
      }
    },
    [],
  );

  const signup = useCallback(() => register(email, password), [email, password, register]);

  const goToLogin = useCallback(() => navigation.navigate('Login'), [navigation]);

  const showAlert = useCallback(text => alert(text), []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        labelValue={email}
        onChangeText={onChange('email')}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={onChange('password')}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry
      />

      <FormInput
        labelValue={confirmPassword}
        onChangeText={onChange('confirm-password')}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry
      />

      <FormButton buttonTitle="Sign Up" onPress={signup} />

      <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{' '}
        </Text>
        <TouchableOpacity onPress={showAlert('Terms Clicked')}>
          <Text style={[styles.color_textPrivate, styles.dimColor]}>Terms of service</Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <Text style={[styles.color_textPrivate, styles.dimColor]}>Privacy Policy</Text>
      </View>

      {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle="Sign Up with Facebook"
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            // onPress={() => {}}
          />

          <SocialButton
            buttonTitle="Sign Up with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            // onPress={() => {}}
          />
        </View>
      ) : null}

      <TouchableOpacity style={styles.navButton} onPress={goToLogin}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  dimColor: {color: '#e88832'},
});

export default SignupScreen;
