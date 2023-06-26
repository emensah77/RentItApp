import React, {useCallback, useRef, useState} from 'react';
import {View, Image, Pressable, Modal} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {styles} from './styles';
import Typography from '../../componentsV2/DataDisplay/Typography';
import Carousel from '../../componentsV2/DataDisplay/Carousel';
import CloseIcon from '../../../assets/data/images/icons/close-icon.png';
import MapIcon from '../../../assets/data/images/icons/map-icon.png';
import Heart from '../../../assets/data/images/icons/heart.svg';
import InputFieldNew from '../../InputFieldNew';
import MapOverlay from '../../componentsV2/Inputs/MapOverlay';

const WishtListItem = ({route}) => {
  const item = route?.params.item;
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const openModal = () => {
    setOpen(!open);
  };

  const openMaps = () => {
    setMapOpen(true);
  };

  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <View style={styles.mainContent}>
      <Typography variant="xlarge" bold>
        {item?.title}
      </Typography>
      <View style={styles.topContent}>
        <View style={styles.wishListTop}>
          <Typography style={{textAlign: 'center'}}>Dates</Typography>
        </View>
        <View style={[styles.wishListTop, styles.guestsText]}>
          <Typography style={{textAlign: 'center'}}>Guests</Typography>
        </View>
      </View>

      <Carousel
        postId={item.id}
        images={item.images}
        round
        minimal
        rightAction={() => {}}
        rightImage={<Heart />}
      />
      <Typography style={{marginTop: 12}} bold>
        Harlingen, Netherlands
      </Typography>
      <Typography style={{color: '#717171', marginTop: 5}}>Professional Host</Typography>
      <Typography style={{color: '#717171', marginTop: 5}}>18-23 Dec</Typography>
      <View>
        <Typography style={{marginTop: 8}} bold>
          ${item.newPrice} total
        </Typography>
      </View>
      <Pressable style={styles.mapBlock} onPress={openMaps}>
        <View style={styles.mapContent}>
          <Typography bold style={{color: '#fff'}}>
            Map
          </Typography>
          <Image source={MapIcon} />
        </View>
      </Pressable>
      {open && (
        <Modal transparent={true}>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={openModal}>
                  <Image source={CloseIcon} />
                </Pressable>
                <Typography variant="large" bold>
                  Settings
                </Typography>
                <Pressable>
                  <Typography style={styles.deleteButton} bold>
                    Delete
                  </Typography>
                </Pressable>
              </View>
              <View style={styles.modalBody}>
                <InputFieldNew name="Name" requirementText="50 characters maximum" />
              </View>
              <View style={styles.modalFooter}>
                <Pressable onPress={openModal}>
                  <Typography style={styles.cancelButton} bold>
                    Cancel
                  </Typography>
                </Pressable>
                <Pressable style={styles.createButtonBox}>
                  <Typography style={styles.createButton} bold>
                    Create
                  </Typography>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
      {mapOpen && <MapOverlay ref={bottomSheetRef} posts={[item]} />}
    </View>
  );
};
export default WishtListItem;
