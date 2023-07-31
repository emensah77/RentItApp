import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomMarker from '../../../components/CustomMarker';
import {styles} from './styles';
import CircleButton from '../CircleButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Pressable, View} from 'react-native';

const MapOverlay = ({posts, bottomSheetRef, handleSheetChanges, onClose}) => {
  const map = useRef();
  const snapPoints = useMemo(() => ['25%', '98%'], []);
  const [showMap, setShowMap] = useState(false);
  console.log('posts', posts);

  const handleClosePress = () => {
    bottomSheetRef?.current?.close();
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowMap(true);
    }, 2000);
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <>
        <View style={styles.top_actions}>
          <CircleButton
            onPress={handleClosePress}
            image={<FontAwesome name="close" size={18} color="black" />}
            minimal
          />
        </View>
        {showMap && (
          <MapView.Animated
            ref={map}
            style={{width: '100%', height: '100%', backgroundColor: 'white'}}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            zoomEnabled
            minZoomLevel={12}
            // onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
            initialRegion={{
              latitude: 5.602028159656166,
              longitude: -0.183158678544458,
              latitudeDelta: 0.8,
              longitudeDelta: 0.8,
            }}>
            {posts.map(place => (
              <CustomMarker
                isSelected
                onPress={() => {}}
                coordinate={{latitude: place.latitude, longitude: place.longitude}}
                price={place.newPrice}
              />
            ))}
          </MapView.Animated>
        )}
      </>
    </BottomSheet>
  );
};

export default MapOverlay;
