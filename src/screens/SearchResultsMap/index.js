import React, {useState, useEffect, useRef} from 'react';
import {View, Text, FlatList} from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import CustomMarker from '../../components/CustomMarker';
import PostCarouselItem from '../../components/PostCarouselItem';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts} from '../../graphql/queries'; 
import { Dimensions} from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
const mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#120202"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#383838"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#23a0fd"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.icon",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#16659e"
        }
      ]
    }
  ]
const SearchResultsMaps = ({guests, viewport}) => {
    
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
    

    const fetchPostsOnChange = async (region) => {
      const Latitude = region.latitude;
      const Longitude = region.longitude;
      const LatitudeDelta = region.latitudeDelta;
      const LongitudeDelta = region.longitudeDelta;
      console.log('Latitude',Latitude);
      console.log('Longitude',Longitude);
      console.log('LatitudeDelta',LatitudeDelta);
      console.log('LongitudeDelta',LongitudeDelta);
      
      try{

          const postsResult = await API.graphql(
              graphqlOperation(listPosts, {
                  filter: {
                      and: {
                          maxGuests: {
                              ge: guests
                          },
                          latitude: {
                              between: [
                                  Latitude - (LatitudeDelta/2),
                                  Latitude + (LatitudeDelta/2),
                                  
                                  
                                  //viewport.southwest.lat,
                                  //viewport.northeast.lat,
                              ],
                          },
                          longitude: {
                              between: [
                                
                                Longitude - (LongitudeDelta/2),
                                Longitude + (LongitudeDelta/2),
                                  //viewport.southwest.lng,
                                  //viewport.northeast.lng,
                              ],
                          }
                      }
                      
                  }
              })
          )
          
          setPosts(postsResult.data.listPosts.items);
          console.log(posts);
      } catch (e){
          console.log(e);
      }
  }
    
    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts, {
                        filter: {
                            and: {
                                maxGuests: {
                                    ge: guests
                                },
                                latitude: {
                                    between: [
                                        viewport.southwest.lat,
                                        viewport.northeast.lat,
                                    ],
                                },
                                longitude: {
                                    between: [
                                        viewport.southwest.lng,
                                        viewport.northeast.lng,
                                    ],
                                }
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
               <View 
                        style={{backgroundColor: '#fff',
                        width: Dimensions.get('screen').width - 20,
                        marginHorizontal: 10,
                        height: 60,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: "flex",
                        flexDirection: "row",
                        position: "absolute",
                        top: 20,
                        zIndex:1,}}>
                        <Feather name="home" size={25} color={"blue"}/>
                        <Text style={{
                              fontSize: 18,
                              fontWeight: 'bold',}}> {posts.length} homes to rent</Text>
                            
                      </View>
            
            <MapView
                ref={map}
                style={{width:'100%', height: '100%', backgroundColor:"white"}}
                provider={PROVIDER_GOOGLE}
                customMapStyle={mapStyle}
                zoomEnabled={true}
                minZoomLevel={12}
                onRegionChangeComplete={(region) => fetchPostsOnChange(region)}
                initialRegion={{
                latitude: 5.602028159656166, 
                longitude: -0.183158678544458,
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

            <View style={{position: 'absolute', bottom: 10}}>
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