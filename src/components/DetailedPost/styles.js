import { StyleSheet } from "react-native";

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
      
      
});

export default styles;