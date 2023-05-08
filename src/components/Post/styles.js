import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  favorite: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    margin: 8,
    right: 0,
    top: 5,
    position: 'absolute',
    height: 35,
    width: 35,
    backgroundColor: 'white',
    elevation: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forSale: {
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 30,
    margin: 10,
    left: 0,
    top: 5,
    position: 'absolute',
    height: 30,
    width: 80,
    backgroundColor: 'white',
    elevation: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forSaleText: {fontSize: 14, fontWeight: 'bold'},
  location: {marginTop: 5, fontWeight: '400', fontSize: 14},
  typeTitle: {marginTop: 5, fontWeight: '400', fontSize: 14},
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
