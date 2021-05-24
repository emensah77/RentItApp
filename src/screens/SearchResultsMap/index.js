import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import places from '../../../assets/data/feed';
import CustomMarker from '../../components/CustomMarker';
import PostCarouselItem from '../../components/PostCarouselItem';
const SearchResultsMaps = (props) => {
    const [selectedPlacedId, setSelectedPlacedId] = useState(null);
    
    return (
        <View style={{width: '100%', height: '100%'}}>
            <MapView
                style={{width:'100%', height: '100%'}}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                latitude: 28.3279822,
                longitude: -16.5124847,
                latitudeDelta: 0.8,
                longitudeDelta: 0.8,
                }}
            >

            {places.map(place => (
            <CustomMarker
                isSelected={place.id === selectedPlacedId}
                onPress={() => setSelectedPlacedId(place.id)}
                coordinate={place.coordinate}
                price={place.newPrice}
                />)
                )}
            

            </MapView>

            <View style={{position: 'absolute', bottom: 20}}>
                <PostCarouselItem post={places[0]}/>
            </View>
        </View>
    );



};

export default SearchResultsMaps;