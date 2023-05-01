import {Dimensions, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  textInput: {
    fontSize: 20,
    marginBottom: 2,
    fontFamily: 'Montserrat-Bold',
    paddingVertical: 5,
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

  button1: {
    borderWidth: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    borderColor: 'darkgray',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: 'darkgray',
    marginHorizontal: 20,
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

  text: {
    fontFamily: 'Mo',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
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

  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  footer: {
    flex: 2,
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
});

export default styles;
