import React, {useEffect, useState} from 'react'
import {View, FlatList,StatusBar, StyleSheet ,Pressable,Text, ScrollView, Platform, TouchableOpacity, ActivityIndicator} from 'react-native';
import Post from '../../components/Post';
import {API, graphqlOperation} from 'aws-amplify';
import {listPosts} from '../../graphql/queries'; 
import {OptimizedFlatList} from 'react-native-optimized-flatlist'
import Fontisto from "react-native-vector-icons/Fontisto";
import { Dimensions} from "react-native";
import Feather from 'react-native-vector-icons/Feather';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import styles from '../Home/styles';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {useNavigation} from "@react-navigation/native";
import uuid from 'react-native-uuid';


const SearchResultsScreen = ({guests, viewport}) => {
    
    
    const[posts, setPosts] = useState([]);
    const[loading, setLoading] =  useState(true);
    const [datalist, setDatalist] = useState([]);
    const [page, setPage] =  useState(0);
    const [isLoading, setIsLoading] = useState(false);
    


    const [status, setStatus] = useState('All');
    const [modeStatus, setModeStatus] = useState('Everything');
    const navigation = useNavigation();
    
    const modes = [
        {
            status: 'Everything',
            id: 1,
        },
        {
            status: 'For Rent',
            id: 2
        },
        {   status: 'For Sale',
            id: 3

        }
    ]
    
    const categories = [
        {
            status: 'All',
            id: 1,
            
        },

        {
            status: 'Entire Flat',
            id: 2,
            
        },
        {
            status: 'Apartment',
            id: 3,
            
        },
        {
            status: 'Mansion',
            id: 4,
        },
        {
            status: 'Self-Contained',
            id: 5,
            
        },
        {
            status: 'Single Room',
            id: 6,
            
        },
        {
            status: 'Full Home',
            id: 7,
            
        }

    ]
    
     
    const fetchPosts = async () => {
        try{
            const postsResult = await API.graphql(
                graphqlOperation(listPosts,  {

                
               
                limit: 1000000,
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
                    
                },
                
                
            })
            )
            //console.log('postsResult',postsResult.data.listPosts.items)
            setPosts(postsResult.data.listPosts.items);
            setDatalist(postsResult.data.listPosts.items);
            

            if(loading){
                setLoading(false);
            }
        } catch (e){
            console.log(e);
        }
    }
    useEffect ( async() => {
        
        
        
        fetchPosts();
        
       
    }, [posts])
    
    
    const renderLoader = () => {
        return(
            isLoading ? 
            <View style={{marginVertical:16, alignItems:'center'}}>
                <ActivityIndicator size={"large"} color="blue"/>
            </View>
            :
            null

            
        )
    }
    const loadMore = () => {
        console.log('pagenumber', page)
        setIsLoading(true);
        setPage( page + 10);
        setIsLoading(false);
    }
    const setStatusFilter = status => {
        if (status !== 'All'){
            setDatalist([...posts.filter(category => category.type === status)])
        }else{
            setDatalist(posts)
        }
        setStatus(status)
    }

    const setModeFilter = modeStatus => {
        if (modeStatus !== 'Everything'){
            setDatalist([...posts.filter(category => category.mode === modeStatus)])
        }else{
            setDatalist(posts)
        }
        setModeStatus(modeStatus)
    }
    
    const renderItem = ({item, index}) =>{
        
        return (
            
            <View key={item}>
                <Post post={item}/>
            

            </View>
        )
    }
    
    if (!loading && posts.length === 0){
        return (
            <View style={{flex:1, paddingTop:25, padding:15, backgroundColor:'white' }} >
                    <Text 
                    style={{
                    fontFamily:'Montserrat-Bold',
                    fontSize:20
                    }}>No Homes Here</Text>
                    <View style={{padding:10}}>
                        <Text style={{fontSize:16, fontFamily:'Montserrat-Regular'}}>
                            There are no homes in the area you searched. Try expanding your search to include 
                            other towns and cities near this area.
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => navigation.goBack()}
                    style={{
                        
                        alignItems:'center',
                        justifyContent:'center',
                        borderWidth:1, borderColor:'black',
                        width:'40%', height:'10%',
                        backgroundColor:'black', 
                        
                        borderRadius:10}}>
                        <Text style={{
                            fontSize:16,
                            fontFamily:'Montserrat-Bold',
                            color:'white'
                        }}>Search Again</Text>
                    </TouchableOpacity>
                </View>
        )
    }
    return (
        
      
        <View style={{paddingBottom:100 ,marginBottom:100, backgroundColor:'white'}}>
            {/* <View style={{marginTop:10, flexDirection:'row', justifyContent:'space-between'}}>
            {modes.map((mode) => (
                

                <TouchableOpacity onPress={() => setModeFilter(mode.status)}
                                    style={[styless.button,
                                    modeStatus === mode.status && styless.btnTabActive,
                                    
                                    ]}
                                    
                                    >
                                
                                        <Text style={styless.textTab, modeStatus === mode.status && styless.textTabActive}>{mode.status}</Text>
                                    
                                    
                        </TouchableOpacity>

                    
                    
                ))}
                </View> */}
            
           

            
            {!loading ? <View>
                
            <ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            snapToInterval={100}
            snapToAlignment="center"
            decelerationRate="fast"
            height={50}
            style={{
                flex:1,
                position:'absolute',
                top:Platform.OS === 'ios' ? 90 : 80, 
                paddingHorizontal: 10,
                backgroundColor:'white'
            }}
            contentInset={{ // ios only
                top:0,
                left:0,
                bottom:0,
                right:20
            }}
            contentContainerStyle = {{
                paddingRight: Platform.OS === 'android' ? 20 : 0,
                backgroundColor:'white'
                
            }}
            >
                {categories.map((category) => (
                    <TouchableOpacity onPress={() => setStatusFilter(category.status)}
                        style={[styless.button,
                        status === category.status && styless.btnTabActive,
                        
                        ]}
                        
                        >
                      
                            <Text style={[styless.textTab, status === category.status && styless.textTabActive]}>{category.status}</Text>
                        
                        
                    </TouchableOpacity>
                ))}
            </ScrollView>
                <View 
                            style={{backgroundColor: '#FF007F',
                            width: Dimensions.get('screen').width - 20,
                            marginHorizontal: 10,
                            height: 50,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: "flex",
                            flexDirection: "row",
                            position: "relative",
                            top: 20,
                            zIndex:1,}}>
                            <Feather name="home" size={25} color={"white"}/>
                            <Text style={{
                                    color:'white',
                                    fontSize: 18,
                                    fontWeight: 'bold',}}> {datalist.length} homes to rent</Text>
                                
                            </View>
                        
                
                <View style={{marginBottom:10, top:80, backgroundColor:'white'}}>
                    
                        
            
                  <FlatList
                      removeClippedSubviews={true}
                      data={datalist}
                      maxToRenderPerBatch={5}
                      initialNumToRender={1}
                      onEndReachedThreshold={0}
                      onEndReached={loadMore}
                      keyExtractor={(item, index) => {
                        
                        return uuid.v4().toString();
                      }}
                      renderItem={renderItem} 
                      ListFooterComponent={renderLoader}
                       
                      //renderItem={({item}) => <Post post={item}/>}
                />
                  </View>  
            </View>
                
         : <View style={{alignItems: 'center', justifyContent:"center"}}>
             <AnimatedEllipsis animationDelay={100} style={{
            color: 'blue',
           fontSize: 100,
            
          letterSpacing: -15,
            
           }}/>
            
           </View>
        
        }      
        
          
            
            
        </View>
    );
};
export default SearchResultsScreen;
const styless = StyleSheet.create({

    button: {
                        flexDirection:'row',
                        backgroundColor: 'white',
                        borderRadius: 20,
                        padding:8,
                        paddingHorizontal:20,
                        marginHorizontal:10,
                        height:35,
                        shadowColor: '#000',
                        shadowOffset: { width: 10, height: 10 },
                        shadowOpacity: .2,
                        shadowRadius: 5,
                        elevation: 30,
                        alignItems:'center',
                        borderWidth:.1,
                        borderColor:'black'

    },

    btnTabActive: {
        backgroundColor: 'black'
    },
    textTab: {
        fontSize: 14,
        color:'black',
        
    },
    textTabActive: {
        fontWeight: 'bold',
        color:'white',
        fontSize:16
        
    }

});