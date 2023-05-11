import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useCallback} from 'react';
import {Portal} from 'react-native-portalize';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import SwipeableModal from '../../SwipeableModal/SwipeableModal';
import WishListItem from '../../../screens/Wishlists/components/WishListItem';
import styles from './WishlistsModal.styles';

const WishlistsModal = ({modalizeRef, children = null, headerTitle = null}) => {
  const onClose = useCallback(() => {
    modalizeRef.current?.close(); // current = {close:() => {}, open:() => {}}
  }, [modalizeRef]);

  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, styles.basePadding]}>
        <TouchableOpacity style={styles.icon} onPress={onClose}>
          <Icon name="close" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle ?? 'Your wishlists'}</Text>
      </View>
    ),
    [onClose, headerTitle],
  );

  const renderAddListItem = useCallback(
    () => (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[styles.addListContainer, styles.basePadding, styles.listItemContainer]}>
        <View style={styles.addListItemImage}>
          <FontAwesomeIcon icon={faPlus} size={24} color="#000000" />
        </View>
        <Text style={styles.addListItemTitle}>Create a new wishlist</Text>
      </TouchableOpacity>
    ),
    [],
  );

  const renderListItem = useCallback(
    () => (
      <View style={[styles.listItemContainer, styles.basePadding]}>
        <WishListItem />
      </View>
    ),
    [],
  );

  const renderMainModal = useCallback(
    () => (
      <View style={styles.mainContainer}>
        {children || (
          <>
            {renderAddListItem()}
            {renderListItem()}
          </>
        )}
      </View>
    ),
    [children, renderAddListItem, renderListItem],
  );

  return (
    <Portal>
      <SwipeableModal
        modalizeRef={modalizeRef}
        closeOnOverlayTap={false}
        scrollViewProps={{
          bounces: false,
        }}
        HeaderComponent={renderHeader()}>
        {renderMainModal()}
      </SwipeableModal>
    </Portal>
  );
};

export default WishlistsModal;
