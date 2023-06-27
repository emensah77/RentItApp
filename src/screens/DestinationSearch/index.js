import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StatusBar,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation, useRoute} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import analytics from '@react-native-firebase/analytics';
import SuggestionRow from './SuggestionRow';
import searchResults from '../../../assets/data/search';
import styles from './styles.js';
import {AuthContext} from '../../navigation/AuthProvider';
import useDwellTimeTracking from '../../hooks/useDwellTimeTracking';
import mixpanel from '../../MixpanelConfig.js';

const DestinationSearch = props => {
  const navigation = useNavigation();
  const {user, logout} = useContext(AuthContext);
  const ref = useRef();
  const route = useRoute();
  const hometype = route.params?.type;
  const {trackDwellTime} = useDwellTimeTracking();
  useEffect(trackDwellTime, [trackDwellTime]);
  useEffect(() => {
    ref.current?.focus();
    console.log(hometype);
  }, []);

  return (
    <LinearGradient
      colors={['purple', 'deeppink']}
      start={{x: 0.1, y: 0.2}}
      end={{x: 1, y: 0.5}}
      style={styles.container}
    >
      <StatusBar hidden />
      <Pressable onPress={() => navigation.goBack()}>
        <Fontisto name="angle-left" size={25} style={{color: 'white', margin: 20, marginTop: 30}} />
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.text_header}>Where do you {'\n'} want to rent? </Text>
      </View>

      <Animatable.View style={styles.footer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
        >
          <GooglePlacesAutocomplete
            placeholder="Type where you want to rent"
            ref={ref}
            onPress={async (data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // console.log(data, details.geometry);

              await analytics().logEvent('searchQuery', {
                id: user.uid,
                item: details.name,
                description: user.displayName,
              });
              mixpanel.track('Search Query', {
                id: user.uid,
                location: details.name,
                userName: user.displayName,
              });

              navigation.navigate('Number of Guests', {
                viewport: details.geometry.viewport,
                hometype,
                location: details,
              });
              console.log(details.geometry.viewport);
            }}
            fetchDetails
            styles={{
              textInput: styles.textInput,
              textInputContainer: {
                backgroundColor: 'white',
                borderRadius: 15,
                borderWidth: 0.5,
                height: 40,
              },
              textInput: {
                height: 44,
                color: '#000000',
                fontSize: 18,
                fontFamily: 'Montserrat-Bold',
                paddingHorizontal: 10,
              },
            }}
            query={{
              key: 'AIzaSyBbnGmg020XRNU_EKOTXpmeqbCUCsEK8Ys',
              language: 'en',
              fields: 'geometry',
              components: 'country:gh',
            }}
            suppressDefaultStyles
            renderRow={item => <SuggestionRow item={item} />}
          />
        </KeyboardAvoidingView>
      </Animatable.View>

      {/* Input Component */}
    </LinearGradient>
  );
};

export default DestinationSearch;
