import { StyleSheet } from "react-native";
import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');
const window = Dimensions.get('window');

const fullWidth = window.width;
const fullHeight = window.height;


const styles = StyleSheet.create({
    container: {
        margin: 20,
        
    },
    image: {
        width : '100%',
        aspectRatio: 3 /2,
        resizeMode: 'cover',
        borderRadius: 10, 


    },
    bedrooms: {
        marginVertical: 10,
        color: 'black',
        fontWeight: '600',
        fontSize:14
    },
    description: {
        fontSize: 18,
        lineHeight: 26,
        fontFamily:'Montserrat-Bold'

    },
    
    hairline:{
        alignSelf: 'stretch',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        marginTop: 10,
        marginBottom: 10
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
    longDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginVertical: 20,
    },
    sliderContainer: {
        height: 200,
        width: '90%',
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
      },
    
      wrapper: {},
    
      slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: 8,
      },
      sliderImage: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        borderRadius: 8,
      },
      amenitiesContainer: {
        marginVertical: 20,
      },
      amenityCard: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#e5e5e5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      amenityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
      },
      itemContainer: {
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
        width: 200,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          },
          android: {
            elevation: 2,
          },
        }),
      },
      imageContainer: {
        width: '100%',
        height: 150,
        overflow: 'hidden',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      },
      image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      detailsContainer: {
        padding: 8,
      },
      title: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'left',
      },
      location: {
        fontSize: 12,
        color: '#666',
        textAlign: 'left',
        marginBottom: 4,
      },
      price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
        textAlign: 'left',
      },
      loadMoreButton: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginTop: 16,
        alignSelf: 'center',
      },
      loadMoreText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      loadMore: {
        alignSelf: 'center',
        color: '#666',
        fontSize: 16,
        marginVertical: 16,
      },
      card: {
        borderRadius: 10,
        borderWidth: .5,
        borderColor: 'gray',
        padding: 10,
        width: 150,
        margin: 5,
        height:150,
        backgroundColor: 'white',
        elevation: 2, // add a shadow effect for Android
        shadowColor: 'gray', // add a shadow effect for iOS
        shadowOpacity: 0.5,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      },
      cardText: {
        color: 'blue',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        textAlign: 'center'
      },
      cardItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 10,
      },
      videoWrapper: {
        width: width * 0.3,
        height: width * 0.4,
        borderRadius: 15,
        overflow: "hidden",
        marginRight: 10,
        backgroundColor: "#000",
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center",
      },
      video: {
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
      },
      loadingIndicator: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
      },
      fullscreenVideo: {
        position: "absolute",
        top: Platform.OS === "android" ? 10 : 60,
        left: 20,
        width: fullWidth - 40,
        height: (fullWidth - 40) * 9 / 16,
        borderRadius: 15,
        zIndex: 9999,
        backgroundColor: "#000",
      },
      content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      container1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        padding: 10,
        backgroundColor: 'black',
        justifyContent: 'space-evenly',
      },
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      loadingOverlay: {
        position: 'absolute',
        top: 100,
        left: 100,
        right: 100,
        bottom: 100,
        backgroundColor: "white",
        borderRadius:20,
        height:"20%",
        width:"50%", // You can change the background color and opacity as needed
        justifyContent: 'center',
        alignItems: 'center',
        opacity:1,
        zIndex: 999, // Ensure this value is higher than the zIndex of the DateTimePickerModal
      },
      loadingText: {
        marginTop: 10, // Add some space between the ActivityIndicator and the text
        fontSize: 16,
        fontWeight: 'bold',
        zIndex: 999,
      },
      modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
      },
      modalTitle: {
        fontSize: 20,
        marginBottom: 10,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
      },
      submitButton: {
        backgroundColor: 'dodgerblue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        padding:5
      },
      submitText: {
        color: 'white',
      },
      
});

export default styles;