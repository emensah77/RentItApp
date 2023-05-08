import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  textInput: {
    height: 44,
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    paddingHorizontal: 10,
  },
  image: {
    height: Dimensions.get('window').height / 2.5,
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',

    height: 200,
    width: '100%',
    borderBottomEndRadius: -30,
  },

  iconContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },

  locationText: {
    fontWeight: '800',
  },

  containerFlat: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  //   text: {
  //     fontFamily: 'Mo',
  //     fontSize: 28,
  //     marginBottom: 10,
  //     color: '#051d5f',
  //   },
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

  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    paddingBottom: 10,
    marginBottom: 10,
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
    backgroundColor: 'white',
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
  goBackButton: {
    right: 250,
    height: 60,
    width: 100,
    backgroundColor: 'deeppink',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  goBackButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
  text2: {
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
  text4: {paddingHorizontal: 10, fontFamily: 'Montserrat-SemiBold'},
  progress: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-between',
  },
  main: {
    width: '100%',
    height: '25%',
    backgroundColor: 'white',
  },

  homeTitle: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: 'white',
  },
  subTitle: {
    fontSize: 18,
    paddingBottom: 10,
    fontFamily: 'Montserrat-Bold',
  },

  title2: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
  keyboardView: {
    flex: 1,
  },
  activeIndicatorView: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    width: '80%',
    zIndex: 99,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',
  },
  title3: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  locationButton: {
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 20,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '70%',
    backgroundColor: 'white',
  },
});

export default styles;
