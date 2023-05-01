import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  image: {
    width: '100%',
    // height: 350,
    aspectRatio: 1,
    resizeMode: 'contain',
    borderRadius: 10,
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 30,
    shadowColor: 'white',
    shadowOffset: {
      width: 10,
      height: 10,
    },
    backgroundColor: 'gray',
  },
  bedrooms: {
    marginVertical: 10,
    color: 'black',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    color: 'grey',
    fontWeight: 'normal',
  },
  prices: {
    fontSize: 18,
    marginVertical: 10,
  },
  oldPrice: {
    color: 'darkgray',
    textDecorationLine: 'line-through',
  },
  newPrice: {
    fontWeight: 'bold',
  },
  totalPrice: {
    color: 'darkgray',
    textDecorationLine: 'underline',
  },
});

export default styles;
