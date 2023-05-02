import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  button: {
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
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',

    height: 200,
    width: '100%',
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    paddingBottom: 10,
    paddingHorizontal: 10,
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
});

export default styles;
