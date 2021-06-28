import React, {useEffect, useState} from 'react'
import {View, FlatList, Pressable,Text} from 'react-native';
import Post from '../../components/Post';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts} from '../../graphql/queries'; 
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import Fontisto from "react-native-vector-icons/Fontisto";
import { Dimensions} from "react-native";
import Feather from 'react-native-vector-icons/Feather';

const SearchResultsScreen = (props) => {
    
    const[posts, setPosts] = useState([]);
    
    const {guests, viewport} = props;

    


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
    
    
    return (
      
        <View>
          
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
          
              <View style={{top:80}}>
                <OptimizedFlatList
              data={posts}
              renderItem={({item}) => <Post post={item}/>}
              />
                </View>  
            
        </View>
    );
};
export default SearchResultsScreen;