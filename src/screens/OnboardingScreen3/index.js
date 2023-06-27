import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Pressable,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useNavigation, useRoute} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUtensils,
  faFan,
  faFaucet,
  faBath,
  faBed,
  faToilet,
  faWifi,
  faWater,
} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import styles from './styles.js';

const OnboardingScreen3 = props => {
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSelected, setisSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const route = useRoute();
  const type = route.params?.type;
  const description = route.params?.description;
  const title = route.params?.title;
  const bed = route.params?.bed;
  const bedroom = route.params?.bedroom;
  const bathroom = route.params?.bathroom;
  const mode = route.params?.mode;
  const increment = a => !a;

  const saveProgress = async progressData => {
    try {
      const user = auth().currentUser;
      const screenName = route.name;
      const userId = user.uid;
      await fetch('https://a27ujyjjaf7mak3yl2n3xhddwu0dydsb.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          progress: {
            screenName,
            progressData,
          },
        }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  const onPressHandler = (id, isSelect) => {
    setSelectedItem(id);
    setisSelected(!isSelect);

    console.log(id, isSelect, isSelected);
  };

  const items = [
    {
      name: 'Air Conditioner',
      id: 'Air Conditioner',
    },
    {
      name: 'WiFi',
      id: 'WiFi',
    },
    {
      name: 'Kitchen',
      id: 'Kitchen',
    },
    {
      name: 'Water',
      id: 'Water',
    },
    {
      name: 'Toilet',
      id: 'Toilet',
    },

    {
      name: 'Bathroom',
      id: 'Bathroom',
    },
  ];
  const onSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

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
        <Text style={styles.text_header}> Choose amenities in {'\n'} your home </Text>
      </View>

      <Animatable.View
        useNativeDriver
        animation="fadeInUpBig"
        duration={1500}
        style={styles.footer}
      >
        <ScrollView>
          <SectionedMultiSelect
            styles={{
              chipText: {
                maxWidth: Dimensions.get('screen').width - 90,
              },
              container: {
                margin: 20,
              },

              selectToggleText: {
                fontSize: 15,
              },

              selectToggle: {
                backgroundColor: 'white',
                borderWidth: 1,
                borderRadius: 20,
                margin: 10,
                padding: 10,
              },
              chipContainer: {
                backgroundColor: 'white',
                marginBottom: 10,
              },

              chipText: {
                color: 'black',
                fontSize: 16,
              },

              itemText: {
                color: selectedItems.length ? 'black' : 'darkgrey',
                fontSize: 18,
              },

              selectedItemText: {
                color: 'blue',
              },

              item: {
                paddingHorizontal: 10,
                margin: 10,
              },

              selectedItem: {
                backgroundColor: 'rgba(0,0,0,0.1)',
              },

              scrollView: {paddingHorizontal: 0},
            }}
            items={items}
            showChips
            uniqueKey="id"
            IconRenderer={Icon}
            selectText="Choose amenities in your home"
            showDropDowns
            modalAnimationType="fade"
            readOnlyHeadings={false}
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            colors={{chipColor: 'black'}}
            iconKey="icon"
          />

          {/* <FlatList
        data={items}
        renderItem={({item}) => {
            return (
                <TouchableOpacity
                onPress={ () => (
                    console.log(item.id, item.isSelected)

                    )}
                 style={{

                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 20,
                    borderWidth: item.isSelected === true && item.id === selectedItem ? 3 : 1,
                    borderColor: item.isSelected === true && item.id === selectedItem ? 'black' : 'darkgray',
                    borderRadius:10,
                    marginVertical:20,
                    paddingHorizontal:20,
                    marginHorizontal: 20,
                    flex:1,

            }}
                >
                    <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight: 'bold'}}>{item.title}</Text>

                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>

                    <FontAwesomeIcon icon={item.icon}  size={25} color={'blue'}/>

                    </View>

                </TouchableOpacity>
            )
        }}
        /> */}

          <TouchableOpacity
            disabled={selectedItems.length === 0}
            onPress={async () => {
              await saveProgress({
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: selectedItems,
              });
              navigation.navigate('OnboardingScreen4', {
                type,
                title,
                description,
                bed,
                bedroom,
                bathroom,
                mode,
                amenities: selectedItems,
              });
            }}
            style={{
              opacity: selectedItems.length === 0 ? 0.4 : 1,
              left: 250,
              width: 100,
              backgroundColor: 'deeppink',
              borderRadius: 20,
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animatable.View>
    </LinearGradient>
  );
};

export default OnboardingScreen3;
