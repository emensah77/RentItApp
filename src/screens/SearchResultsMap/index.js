import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList} from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import CustomMarker from '../../components/CustomMarker';
import PostCarouselItem from '../../components/PostCarouselItem';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts} from '../../graphql/queries'; 


const SearchResultsMaps = (props) => {
    const {guests} = props;
    const[posts, setPosts] = useState([]);
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
    
    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts, {
                        filter: {
                            maxGuests: {
                                ge: guests
                            }
                        }
                    })
                )

                setPosts(postsResult.data.listPosts.items);
            } catch (e){
                console.log(e);
            }
        }

        fetchPosts();
    }, [])









    useEffect(() => {
        if(!selectedPlacedId || !flatlist ){
            return ;
        }
        const index = posts.findIndex(place => place.id === selectedPlacedId)
        flatlist.current.scrollToIndex({index})

        const selectedPlace = posts[index];
        const region = {
            latitude: selectedPlace.latitude,
            longitude: selectedPlace.longitude,
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

            {posts.map(place => (
            <CustomMarker
                isSelected={place.id === selectedPlacedId}
                onPress={() => setSelectedPlacedId(place.id)}
                coordinate={{latitude: place.latitude, longitude: place.longitude}}
                price={place.newPrice}
                />)
                )}
            

            </MapView>

            <View style={{position: 'absolute', bottom: 30}}>
                <FlatList 
                    ref={flatlist}
                    data={posts}
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