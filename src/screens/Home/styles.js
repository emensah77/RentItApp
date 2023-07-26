import {StyleSheet, Dimensions, Platform} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {backgroundColor: 'white', flex: 1},
  loader: {marginVertical: 100, alignItems: 'center'},
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalContainer: {paddingTop: 10},
  marginTop10: {marginTop: 20},
  margin10: {margin: 10},
  modalScrollView: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  priceRangeContainer: {flex: 1, alignSelf: 'center'},
  priceText: {fontWeight: 'bold', fontSize: 20},
  valueContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueInnerContainer: {
    alignItems: 'center',
    width: 50,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  textWrapper: {
    alignItems: 'center',
    width: 100,
    padding: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  rentPressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    flex: 1,
  },
  statusOfHome: {padding: 15},
  statusOfHomeText: {fontWeight: 'bold', fontSize: 20},
  forRent: {fontSize: 15, fontWeight: '600'},
  amenitiesContainer: {marginBottom: 40, padding: 15},
  amenitiesText: {fontSize: 18, fontWeight: 'bold'},
  forRentDesc: {fontSize: 12, paddingTop: 5},
  rentContainer: {flexDirection: 'column'},
  salePressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderColor: 'black',
    borderRadius: 10,
    marginVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    flex: 1,
  },
  showHomes: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 20,
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    width: '90%',
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 0,
    height: 50,
  },
  showHomesText: {alignSelf: 'center', color: 'white'},
  filterPressable: {
    backgroundColor: 'white',
    borderRadius: 20,

    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: 'black',
    justifyContent: 'space-evenly',
  },
  filterText: {fontWeight: '600', paddingTop: 5},
  mainScrollView: {
    flex: 1,
    position: 'absolute',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  padding14: {paddingBottom: 14},
  padding2: {paddingTop: 2},
  loadingIndicator: {
    flex: 1,
    marginBottom: 10,
    top: Platform.OS === 'android' ? 150 : 200,
    backgroundColor: 'white',
  },
  loaderList: {marginVertical: 100, alignItems: 'center'},
  padding40: {paddingBottom: 40},
  videoLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoInnerContainer: {
    backgroundColor: 'black',
    borderRadius: 30,
    borderColor: 'white',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
  },
  forSale: {flexDirection: 'column'},
  forSaleText: {fontSize: 15, fontWeight: '600'},
  forSaleDesc: {fontSize: 12, paddingTop: 5},
  image: {
    width: '100%',
    height: 500,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: 'black',
  },

  image1: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    justifyContent: 'center',
    borderRadius: 5,
  },

  title: {
    fontSize: 30,
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    marginLeft: 25,
    top: 10,
    alignSelf: 'center',
  },

  imageLocationIcon: {
    position: 'absolute',
    marginTop: 4,
    left: 5,
    bottom: 10,
  },
  ImageText: {
    position: 'absolute',
    color: 'white',
    marginTop: 4,
    fontSize: 18,
    fontWeight: 'bold',
    left: 35,
    bottom: 15,
  },

  ImageOverlay: {
    width: 250,
    height: 250,
    marginRight: 8,
    borderRadius: 10,
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
  },

  ImageOverlay1: {
    width: '100%',
    height: 250,
    alignSelf: 'center',
    borderRadius: 20,
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 1,
  },

  button: {
    backgroundColor: '#fff',
    width: 200,
    marginLeft: 25,
    marginTop: 25,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  searchButton: {
    backgroundColor: 'white',
    width: Dimensions.get('screen').width - 20,
    marginHorizontal: 10,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 50,
    zIndex: 10,
    shadowOpacity: 1,
    shadowColor: 'transparent',
    elevation: 30,
    borderWidth: 1,
    borderColor: 'lightgrey',
    shadowRadius: 10,
    shadowOffset: {
      width: 10,
      height: 10,
    },
  },

  searchButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  button1: {
    marginRight: 20,
    alignItems: 'center',
    height: 70,
    borderWidth: 0.1,
  },

  textTab: {
    fontSize: 11,
    color: 'black',
  },
  textTabActive: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },

  mapContent: {
    alignItems: 'center',
    backgroundColor: '#0047B3',
    width: wp(22),
    left: wp(39),
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 12,
    position: 'absolute',
    bottom: wp(10),
  },
  cardContainer: {
    position: 'absolute',
    bottom: 0,
    width: '90%', // Adjust the width to account for the margin
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 20, // Add equal margin on all sides
    elevation: 5, // Add elevation for Android
    shadowColor: '#000', // shadow properties for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  cardImage: {
    width: '30%',
    aspectRatio: 1,
    borderTopLeftRadius: 20,
  },
  cardDetails: {
    width: '70%',
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  locality: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row', // To place bedrooms and bathrooms text side by side
    justifyContent: 'space-between', // To put space between them
    marginVertical: 10, // To provide vertical spacing
  },

  detailsText: {
    color: '#555', // Or any other color of your choice
    fontSize: 16, // Or any other size of your choice
  },

  price: {
    alignSelf: 'flex-start', // Aligns price to the bottom-right
    fontSize: 12,
    fontWeight: 'bold',
  },

  map: {width: '100%', height: '100%', backgroundColor: 'white'},
  loaderContainer: {paddingBottom: 0, marginHorizontal: 20},
});
export default styles;
