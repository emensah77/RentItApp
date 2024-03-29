import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 120,
    padding: 15,
    justifyContent: 'space-around',
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },

  innerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 20,
    borderColor: 'black',
  },
  image: {
    height: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  bedrooms: {
    marginVertical: 10,
    color: 'darkgray',
  },
  description: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  prices: {
    fontSize: 16,
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
