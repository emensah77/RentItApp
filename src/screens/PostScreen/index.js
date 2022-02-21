import React, {useEffect, useState} from 'react';
import {View,Image, Text} from 'react-native';
import DetailedPost from '../../components/DetailedPost';
import {listPosts} from '../../graphql/queries';
import {useRoute} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';
import AnimatedEllipsis from 'react-native-animated-ellipsis';


const PostScreen = (props) =>{
    const route = useRoute();
    const [post, setPosts] = useState(null);
    
    



    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts)
                )

                setPosts(postsResult.data.listPosts.items.find(place => place.id === route.params.postId));
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
             })
           }catch(e){
               return;
           }
       })
       
       }

        fetchPosts();
        if(post){
        preloadImages(post.images)}
        
    })
    
    if(post === undefined){
        return null;
    
    }
    
     

   
    
    
    if (!post){
        return (
            <View style={{alignItems: 'center', justifyContent:"center"}}>
             <AnimatedEllipsis animationDelay={100} style={{
            color: 'blue',
           fontSize: 100,
            
          letterSpacing: -15,
            
           }}/>
            
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