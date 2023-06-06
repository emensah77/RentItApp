import React, {useState, useCallback} from 'react';
import {View, Image, Pressable, FlatList, TextInput, SafeAreaView, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';

import Typography from '../../componentsV2/DataDisplay/Typography';

import {styles} from './styles';

import BackArrow from '../../../assets/data/images/icons/back-arrow.png';

import Button from '../../componentsV2/Inputs/Button';

const OnboardingScreen9 = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const [checkItem, setCheckItem] = useState(0);
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
  const data = [
    {
      id: 1,
      title: 'Loyalty Home',
      text: 'You have given a loyalty package to this homeowner',
    },
    {
      id: 2,
      title: 'Negotiable',
      text: 'Price can be negotiated with the home owner',
    },
    {
      id: 3,
      title: 'Furnished',
      text: 'Property comes with furniture and amenities',
    },
  ];
  const checkData = id => {
    setCheckItem(id);
  };
  const renderItems = useCallback(
    ({item}) => {
      return (
        <Pressable
          style={[styles.itemData, item.id === checkItem ? styles.itemCheckData : '']}
          onPress={() => checkData(item.id)}>
          <Typography bold>{item.title}</Typography>
          <Typography style={{color: '#4D4D4D'}}>{item.text}</Typography>
        </Pressable>
      );
    },
    [checkItem],
  );
  const goFaqs = () => {
    navigation.navigate('OnboardingScreen10');
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContent}>
          <View style={styles.topBar}>
            <Pressable style={styles.backButton}>
              <Image source={BackArrow} />
            </Pressable>
            <View style={styles.topButtons}>
              <Pressable
                style={styles.topButton}
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
                }}>
                <Typography style={styles.topButtonText}>Save & exit</Typography>
              </Pressable>
              <Pressable style={styles.topButton} onPress={goFaqs}>
                <Typography style={styles.topButtonText}>FAQs</Typography>
              </Pressable>
            </View>
          </View>

          <Typography bold style={styles.title}>
            Your home is?
          </Typography>
          <FlatList data={data} renderItem={renderItems} />
          <Typography style={{textAlign: 'center', marginTop: 28}} bold>
            Enter the homeowner’s name
          </Typography>
          <TextInput placeholder="Homeowner’s Name" style={styles.input} />
          <Typography style={{textAlign: 'center', marginTop: 28}} bold>
            Is your home available for rent now?
          </Typography>
          <View style={styles.btn}>
            <Button text="Yes" style={styles.btnYes} />
            {/* <Button text="No" variant="defaultText" style={styles.btnNo} /> */}
            <Pressable style={styles.btnNo}>
              <Typography style={{color: '#194CC3', textAlign: 'center', paddingTop: 15}}>
                No
              </Typography>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnboardingScreen9;
