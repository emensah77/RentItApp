import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList} from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import places from '../../../assets/data/feed';
import CustomMarker from '../../components/CustomMarker';
import PostCarouselItem from '../../components/PostCarouselItem';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
const SearchResultsMaps = (props) => {
    const [selectedPlacedId, setSelectedPlacedId] = useState(null);
    const width = useWindowDimensions().width;
    const flatlist = useRef();
    const map = useRef();
    const viewConfig = useRef({itemVisiblePercentThreshold:70})
    const onViewChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0){
            const selectedPlace = viewableItems[0].item;
            setSelectedPlacedId(selectedPlace.id)
        }
    })
    
    useEffect(() => {
        if(!selectedPlacedId || !flatlist ){
            return ;
        }
        const index = places.findIndex(place => place.id === selectedPlacedId)
        flatlist.current.scrollToIndex({index})

        const selectedPlace = places[index];
        const region = {
            latitude: selectedPlace.coordinate.latitude,
            longitude: selectedPlace.coordinate.longitude,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
        }
        
            map.current.animateToRegion(region);
        
        
    }, [selectedPlacedId])
    
    return (
        <View style={{width: '100%', height: '100%'}}>
            <MapView
                ref={map}
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
                <FlatList 
                    ref={flatlist}
                    data={places}
                    renderItem={({item}) => <PostCarouselItem post={item}/>}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={width - 60}
                    snapToAlignment={"center"}
                    decelerationRate={"fast"}
                    viewabilityConfig={viewConfig.current}
                    onViewableItemsChanged={onViewChanged.current}
                    
                />
            </View>
        </View>
    );



};

export default SearchResultsMaps;