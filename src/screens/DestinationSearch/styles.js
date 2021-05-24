import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        padding: 20,
        
        height: '100%',
        backgroundColor: 'white'

    },

    textInput: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: "bold",
        
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
    }
});

export default styles;