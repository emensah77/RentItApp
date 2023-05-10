import React, {useCallback, useRef} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMap} from '@fortawesome/free-solid-svg-icons';
import styles1 from './FirstScreenOfWishlists.styles';
import styles2 from './SecondScreenOfWishlists.styles';
import WishListCarousel from './components/WishListCarousel';
import SettingModal from './components/SettingModal';

export default () => {
  const modalRef = useRef();

  const openModal = useCallback(() => {
    modalRef.current.open();
  }, [modalRef]);

  const closeModal = useCallback(() => {
    modalRef.current.close();
  }, []);

  const renderHeader = useCallback(
    () => (
      <>
        <Text style={[styles1.title, styles2.title]}>Weekend away</Text>

        <View style={styles2.buttonContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles2.button}>
            <Text style={styles2.buttonText}>Dates</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} style={[styles2.button, styles2.ml12]}>
            <Text style={styles2.buttonText}>Guests</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [],
  );

  const renderCarousel = useCallback(() => <WishListCarousel />, []);

  const renderDescription = useCallback(
    () => (
      <View style={styles2.descriptionContainer}>
        <View style={styles2.desRight}>
          <Text style={styles2.desTitle}>Harlingen, Netherlands</Text>
          <Text style={styles2.desSubTitle}>Professional Host</Text>
          <Text style={styles2.desSubTitle}>18-23 Dec</Text>
          <Text style={styles2.desTitle}>
            $1,065 <Text style={styles2.desSubTitle}>total</Text>
          </Text>
        </View>

        <View>
          <Text style={styles2.desTitle}>
            <View style={styles2.starIconOfDes}>
              <Icon name="star" size={12} />
            </View>
            4.76
          </Text>
        </View>
      </View>
    ),
    [],
  );
  return (
    <SafeAreaView style={styles1.container}>
      <ScrollView contentContainerStyle={styles2.scrollView}>
        {renderHeader()}
        {renderCarousel()}
        {renderDescription()}

        <TouchableOpacity style={styles2.mapButton}>
          <Text style={[styles2.desTitle, styles2.whiteText]} onPress={openModal}>
            Map
            <View style={styles2.starIconOfDes}>
              <FontAwesomeIcon icon={faMap} size={16} color="white" />
            </View>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <SettingModal modalizeRef={modalRef} />
    </SafeAreaView>
  );
};
