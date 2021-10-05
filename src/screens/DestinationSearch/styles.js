import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    

    textInput: {
        fontSize: 20,
        marginBottom: 2,
        fontFamily:'Montserrat-Bold',
        paddingVertical:5,
        paddingHorizontal: 10,
        color:"black"
       
        
        
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgray',
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
      wrapper: {},
      sliderContainer: {
          height: 200,
          width: '90%',
          marginTop: 10,
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 8,
          marginBottom:150,
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
      text: {
          color: '#fff',
          fontSize: 40,
          fontWeight: 'bold'
        },
        header: {
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 10,
          paddingBottom: 20
      },
      footer: {
          flex: 5,
          backgroundColor: '#fff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingVertical: 30,
          
      },
      text_header: {
          color: '#fff',
          fontFamily:"Montserrat-Semi-Bold",
          
          fontSize: 30
      },
      text_footer: {
          color: '#05375a',
          fontSize: 18
      },
      action: {
          flexDirection: 'row',
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f2f2f2',
          paddingBottom: 5
      },
      actionError: {
          flexDirection: 'row',
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#FF0000',
          paddingBottom: 5
      
      },
      errorMsg: {
          color: '#FF0000',
          fontSize: 14,
      },
      button: {
          alignItems: 'center',
          marginTop: 50
      },
      signIn: {
          width: '100%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10
      },
      textSign: {
          fontSize: 18,
          fontWeight: 'bold'
      },
      container: {
        flex: 1, 
        backgroundColor: 'blue'
      },
      title: {
        color: 'blue',
        fontSize: 25,
        
        fontFamily:'Montserrat-Bold'
    },
    text: {
      color: 'blue',
      marginTop:5,
      fontSize:20,
      fontFamily:'Montserrat-Bold'
    },
});

export default styles;