import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  TextInput,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {API, graphqlOperation} from 'aws-amplify';
import ImageCarousel from '../../components/ImageCarousel';
import {updatePost} from '../../graphql/mutations';

const EditHome = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {homeInfo} = route.params;
  const [selectedItems, setSelectedItems] = useState();
  const [title, setTitle] = useState(homeInfo?.title);
  const [description, setDescription] = useState(homeInfo?.description);
  const [maxGuests, setMaxGuests] = useState(homeInfo?.maxGuests?.toString());
  const [price, setPrice] = useState(homeInfo?.newPrice?.toString());

  console.log(description.replace(/(\r\n|\n|\r)/gm, ' '));

  const onSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);
  };

  const submitHandler = async () => {
    const input = {
      id: homeInfo?.id,
      title,
      description,
      maxGuests: parseInt(maxGuests),
      newPrice: parseInt(price),
      oldPrice: parseInt(price),
      aircondition: selectedItems.includes('aircondition') ? 'Yes' : 'No',
      wifi: selectedItems.includes('wifi') ? 'Yes' : 'No',
      kitchen: selectedItems.includes('kitchen') ? 'Yes' : 'No',
      bathroom: selectedItems.includes('bathroom') ? 'Yes' : 'No',
      water: selectedItems.includes('water') ? 'Yes' : 'No',
      toilet: selectedItems.includes('toilet') ? 'Yes' : 'No',
    };

    try {
      await API.graphql(graphqlOperation(updatePost, {input}));
      navigation.navigate('Welcome');
      Alert.alert('Updated Successfully');
    } catch (e) {
      console.log('error', e);
    }
    r;
  };

  useEffect(() => {
    const tempAmeneties = [
      {name: 'wifi', value: homeInfo?.wifi},
      {name: 'kitchen', value: homeInfo?.kitchen},
      {name: 'toilet', value: homeInfo?.toilet},
      {name: 'water', value: homeInfo?.water},
      {name: 'aircondition', value: homeInfo?.aircondition},
      {name: 'bathroom', value: homeInfo?.bathroom},
    ];

    const amenities = tempAmeneties
      .map((single, index) => {
        if (single?.value === 'Yes') {
          return single?.name;
        }
      })
      .filter(notUndefined => notUndefined !== undefined);
    setSelectedItems(amenities);
  }, []);

  const items = [
    {
      name: 'aircondition',
      id: 'aircondition',
    },
    {
      name: 'wifi',
      id: 'wifi',
    },
    {
      name: 'kitchen',
      id: 'kitchen',
    },
    {
      name: 'water',
      id: 'water',
    },
    {
      name: 'toilet',
      id: 'toilet',
    },

    {
      name: 'bathroom',
      id: 'bathroom',
    },
  ];

  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      <ImageCarousel postId={homeInfo.id} images={homeInfo.images} />
      <ScrollView contentContainerStyle={{paddingBottom: 150}} showsVerticalScrollIndicator={false}>
        <View style={{paddingHorizontal: 20}}>
          <Text style={{...styles.label, marginTop: 10}}>Title</Text>
          <TextInput
            value={title}
            style={styles.input}
            editable
            onChangeText={text => setTitle(text)}
          />
          <Text style={{...styles.label, marginTop: 10}}>Description</Text>
          <TextInput
            value={description}
            style={[styles.input, {height: 100}]}
            editable
            onChangeText={text => setDescription(text)}
            multiline
          />
          <Text style={{...styles.label, marginTop: 10}}>Guests</Text>
          <TextInput
            value={maxGuests}
            style={styles.input}
            editable
            onChangeText={text => setMaxGuests(text)}
            keyboardType="numeric"
          />
          <Text style={{...styles.label, marginTop: 10}}>Price</Text>
          <TextInput
            value={price}
            style={styles.input}
            editable
            keyboardType="number-pad"
            onChangeText={text => setPrice(text)}
          />
          {selectedItems && (
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
                  color: selectedItems?.length ? 'black' : 'darkgrey',
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
          )}
          <TouchableOpacity
            onPress={submitHandler}
            disabled={!title || !description || !maxGuests || !price || selectedItems?.length === 0}
            style={{
              borderWidth: 7,
              borderColor: 'blue',
              backgroundColor: 'blue',
              borderRadius: 10,
              flex: 1,
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Montserrat-Bold',
                color: 'white',
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    color: 'blue',
  },
  labelMargin: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '400',
  },
  input: {
    height: 40,
    marginBottom: 16,
    backgroundColor: '#DAE3F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: 'black',
  },
});

export default EditHome;
