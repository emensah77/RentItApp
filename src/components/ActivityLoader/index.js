import React from 'react';
import { View, Image, StatusBar } from 'react-native';


const ActivityLoader = (props) => {

    return (
        <View 
        
        style={{
            flex:1, justifyContent:'center', alignItems:'center'}}>
            <Image
            style={{width:100, height:100, borderRadius:50}}
            
            source={{uri:'https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270'}}
            />
        </View>
    )

}


export default ActivityLoader;