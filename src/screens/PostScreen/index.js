import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import DetailedPost from '../../components/DetailedPost';
import {listPosts} from '../../graphql/queries';
import {useRoute} from '@react-navigation/native';
import {API, graphqlOperation} from 'aws-amplify';



const PostScreen = (props) =>{
    const route = useRoute();
    const [posts, setPosts] = useState();
    
    



    useEffect ( () => {
        const fetchPosts = async () => {
            try{
                const postsResult = await API.graphql(
                    graphqlOperation(listPosts)
                )

                setPosts(postsResult.data.listPosts.items);
            } catch (e){
                console.log(e);
            }
        }

        fetchPosts();
    })
    if(posts === undefined){
        return null;
    }
    
    const post = posts.find(place => place.id === route.params.postId);
    
    
    
    


  
    



    return (
        <View style={{backgroundColor: 'white'}}>
            <DetailedPost post={post}/>
        </View>
    );


};

export default PostScreen;