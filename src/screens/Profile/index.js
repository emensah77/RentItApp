import React from 'react';
import {View, Text, Pressable} from 'react-native';
import {Auth} from 'aws-amplify';
const ProfileScreen = (props) => {
    const logout = () => {
        Auth.signOut();
    }
    return (
        <View style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Pressable
             onPress={logout}
             style={{alignItems: 'center', justifyContent: 'center', width: '100%', height: 40, backgroundColor: 'yellow'}}>
                <Text>Log Out</Text>
            </Pressable>

        </View>
        
    );

};


export default ProfileScreen;