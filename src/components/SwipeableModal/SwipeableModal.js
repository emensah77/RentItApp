import React from 'react';
import {View, Dimensions} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Portal} from 'react-native-portalize';
import styles from './SwipeableModal.styles';

const {height} = Dimensions.get('window');

const SwipeableModal = ({
  children,
  modalizeRef,
  isSwipe = true,
  isShowHeader = true,
  HeaderComponent,
  HeaderRightComponent,
  scrollViewProps,
  adjustToContentHeight = true,
  backgroundColor,
  isFullScreen,
  isCenter = false,
  ...resOfProps
}) => {
  // Renders
  const renderDefaultHeader = () => (
    <View style={[styles.modalHeader, {backgroundColor}]}>
      <View>{HeaderRightComponent}</View>
    </View>
  );

  const renderHeader = () => {
    if (!isShowHeader) {
      return;
    }

    if (HeaderComponent) {
      return HeaderComponent;
    }

    return renderDefaultHeader();
  };

  return (
    <Portal>
      <Modalize
        ref={modalizeRef}
        withHandle={false}
        closeOnOverlayTap
        tapGestureEnabled
        disableScrollIfPossible={false}
        // closeAnimationConfig={{
        //   spring: {stiffness: 70, mass: 0.2},
        //   timing: {delay: 0, duration: 500},
        // }}
        // openAnimationConfig={{
        //   spring: {stiffness: 70, mass: 0.2},
        //   timing: {delay: 0, duration: 300},
        // }}
        adjustToContentHeight={adjustToContentHeight}
        panGestureComponentEnabled
        {...resOfProps}
        HeaderComponent={renderHeader()}
        panGestureEnabled={isSwipe}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,

          style: {
            backgroundColor,
          },
          contentContainerStyle: [
            isFullScreen && {minHeight: '100%'},
            isCenter && {
              justifyContent: 'center',
              height,
            },
            {backgroundColor},
          ],
          // contentContainerStyle: [
          //   { paddingBottom: insets.bottom },
          //   isFullScreen && { flexGrow: 1, paddingBottom: insets.bottom },
          // ],
          ...scrollViewProps,
        }}>
        {children}
      </Modalize>
    </Portal>
  );
};

export default SwipeableModal;
