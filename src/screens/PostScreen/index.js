import React, {useEffect, useState} from 'react';
import {View,Image, Text} from 'react-native';
import DetailedPost from '../../components/DetailedPost';
import {listPosts} from '../../graphql/queries';
import {useRoute} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import AnimatedEllipsis from 'react-native-animated-ellipsis';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

const PostScreen = ({ route }) =>{
    
    const params = route.params || {};
    const { postId, id } = params;
    const [post, setPosts] = useState(null);
    
    
    const fetchPosts = async () => {
        try{
            const postsResult = await API.graphql(
                graphqlOperation(listPosts, {
                    limit:1000000
                })
            )
            if(id){
                setPosts(postsResult.data.listPosts.items.find(place => place.id === id));
            }
            else{
            setPosts(postsResult.data.listPosts.items.find(place => (place.id === postId)));
            }
        } catch (e){
            console.log(e);
        }
    }

    const preloadImages = async (urlOfImages) => {
        let preFetchTasks = [];
        urlOfImages.forEach((url)=>{
           preFetchTasks.push(Image.prefetch(url));
       });
   
       Promise.all(preFetchTasks).then((results)=>{
       try {
         let downloadedAll = true;
         results.forEach((result)=>{
             if(!result){
                 //error occurred downloading a pic
                 downloadedAll = false;
             }
             //console.log(downloadedAll);
         })
       }catch(e){
           
           return;
       }
   })
   
   }


    useEffect ( () => {
        
        
        
        

        fetchPosts();
        console.log(postId, id, post);
        if(post){
        preloadImages(post.images)}
        
    })
    
    if(post === undefined){
        return null;
    
    }
    
     

   
    
    
    if (!post){
        return (
        //     <View style={{alignItems: 'center', justifyContent:"center"}}>
        //      <AnimatedEllipsis animationDelay={100} style={{
        //     color: 'blue',
        //    fontSize: 100,
            
        //   letterSpacing: -15,
            
        //    }}/>
            
        //    </View>
        <View
         
        
                style={{
                     flex:1,  justifyContent:'center', alignContent:"center" }} >
                    
                    <SkeletonContent
                    containerStyle={{paddingBottom:0, width: '100%'}}
                    animationDirection="horizontalLeft"
                    layout={[
                        // long line
                        { width: '100%', height: 300, marginBottom: 10, borderRadius:10 },
                        { width: 220, height: 20, marginBottom: 10 },
                        // short line
                        { width: 90, height: 20, marginBottom: 10 },
                        { width: 40, height: 20, marginBottom: 80 },

                       
                        { width: '100%', height: 150, marginBottom: 100 },
                        
                        { width: '100%', height: 20, marginBottom: 12, paddingHorizontal:40},
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12},
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12 },
                        { width: '100%', height: 20, marginBottom: 12},
                        
                        
                        
                        // ...
                    ]}
                    >
                        
                    
                    </SkeletonContent>

                    
                </View>

                
        )
    }


  
    



    return (
        <View style={{backgroundColor: 'white'}}>
            <DetailedPost post={post}/>
        </View>
    );


};

export default PostScreen;