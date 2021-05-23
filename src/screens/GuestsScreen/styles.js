import { StyleSheet } from "react-native";

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
            borderBottomWidth: 1,
            borderColor: 'darkgray',
            marginHorizontal: 20,
            
    }
});

export default styles;