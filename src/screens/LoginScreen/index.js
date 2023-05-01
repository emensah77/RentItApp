import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {faApple, faGoogle} from '@fortawesome/free-brands-svg-icons';
import SplashScreen from 'react-native-splash-screen';

import SocialButton from '../../components/SocialButton';
import {AuthContext} from '../../navigation/AuthProvider';

import rentItImage from '../../../assets/data/images/rentitpic1.png';
import home from '../../../assets/data/images/home.png';

const LoginScreen = () => {
  const {googleLogin /* , fbLogin */, appleLogin} = useContext(AuthContext);

  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar hidden />
      <View style={styles.container}>
        <View style={styles.header}>
          <Animatable.Image
            animation="fadeInDownBig"
            duraton={1500}
            source={rentItImage}
            style={styles.rentitImage}
            resizeMode="contain"
          />
          <Text style={styles.text_header}> Welcome </Text>
        </View>
        <Animatable.View
          animation="fadeInUpBig"
          duration={1500}
          style={styles.footer}>
          <Text style={styles.title}>Find your next home</Text>

          <View style={styles.button}>
            <Image source={home} style={styles.home} />

            {Platform.OS === 'ios' ? (
              <View>
                {/* <SocialButton
                  buttonTitle="Continue with Facebook"
                  btnType={faFacebook}
                  color="blue"
                  backgroundColor="white"
                  onPress={() => fbLogin()}
                /> */}

                <SocialButton
                  buttonTitle="Continue with Apple"
                  btnType={faApple}
                  color="black"
                  backgroundColor="white"
                  onPress={appleLogin}
                />

                <SocialButton
                  buttonTitle="Continue with Google"
                  btnType={faGoogle}
                  color="deeppink"
                  backgroundColor="white"
                  onPress={googleLogin}
                />
              </View>
            ) : (
              <View>
                {/* <SocialButton
                  buttonTitle="Continue with Facebook"
                  btnType={faFacebook}
                  color="blue"
                  backgroundColor="white"
                  onPress={() => fbLogin()}
                /> */}
                <SocialButton
                  buttonTitle="Continue with Google"
                  btnType={faGoogle}
                  color="deeppink"
                  backgroundColor="white"
                  onPress={googleLogin}
                />
              </View>
            )}
          </View>
        </Animatable.View>
      </View>
      {/*
      <Text style={styles.text}>RN Social App</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        onPress={() => login(email, password)}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      // */}
      {/* <View style={{marginBottom:20, justifyContent:'center', alignItems:'center'}}>
        <Text style={{color:"blue", fontSize:38, fontFamily:'Montserrat-Bold'}}>RentIt</Text>
         <Text style={{color:'blue', fontSize:21, fontFamily:'Montserrat-Regular'}}>find your next home</Text>
     </View>

         <View style={styles.containerFlat}>
          <Animated.FlatList */}
      {/* //           horizontal
      //           showsHorizontalScrollIndicator={false}
      //           pagingEnabled
      //           onScroll={Animated.event(
      //             [{nativeEvent: {contentOffset: {x: scrollX}}}],
      //             {useNativeDriver: true}
      //           )}
      //           data={data}
      //           keyExtractor={item => item.index}
      //           renderItem={({item, index})=> {
      //             const inputRange = [
      //               (index - 1) * width,
      //               index * width,
      //               (index + 1) * width
      //             ];
      //             const translateX = scrollX.interpolate({
      //               inputRange,
      //               outputRange: [-width * .7, 0, width * .7]
      //             })
      //               return(
      //                 <View style={{width, justifyContent:'center', alignItems:'center'}}>
      //                   <View style={{
      //                     borderRadius: 18,
      //                     padding: 12,
      //                     shadowColor: '#000',
      //                     shadowOpacity: .4,
      //                     shadowRadius: 30,
      //                     elevation: 8,
      //                     backgroundColor:'#fff',
      //                     shadowOffset: {
      //                       width: 0,
      //                       height: 0,
      //                     },
      //                     borderRadius: 18,
      //                   }}>
      //                         <View style={{
      //                      width: ITEM_WIDTH,
      //                      height: ITEM_HEIGHT,
      //                      overflow:'hidden',
      //                      alignItems:'center',
      //                      borderRadius: 18,

      //                   }}>
      //                     <Animated.Image source={{uri: item.photo}}
      //                     style={{
      //                       width: ITEM_WIDTH,
      //                       height: ITEM_HEIGHT,
      //                       resizeMode: 'cover',
      //                       transform: [{
      //                         translateX,

      //                       },
      //                     ],

      //                     }}/>
      //                   </View>

      //                   </View>

      //                 </View>
      //               )
      //           }}
      //           />
      //     </View> */}

      {/*
      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>
    */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerFlat: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Montserrat-Bold',
  },
  wrapper: {},
  sliderContainer: {
    height: 200,
    width: '90%',
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    marginBottom: 150,
  },

  slide1: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#CC3333',
    borderRadius: 8,
    alignItems: 'center',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'purple',
    borderRadius: 8,
    alignItems: 'center',
  },
  slide4: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'green',
    borderRadius: 8,
    alignItems: 'center',
  },
  slide5: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'deeppink',
    borderRadius: 8,
    alignItems: 'center',
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 1.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  title: {
    color: 'blue',
    fontSize: 25,

    fontFamily: 'Montserrat-Bold',
  },
  text: {
    color: 'blue',
    marginTop: 5,
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  rentItImage: {
    height: 200,
    width: 200,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  home: {width: 300, height: 150},
});

export default LoginScreen;
