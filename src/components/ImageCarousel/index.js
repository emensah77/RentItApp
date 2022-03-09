import React, {useState, useCallback} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Fontisto from "react-native-vector-icons/Fontisto";
import {useNavigation} from "@react-navigation/native";
import PaginationDot from 'react-native-animated-pagination-dot'



const ImageCarousel = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currPage] = useState(1);
  const windowWidth = useWindowDimensions().width;
  const navigation = useNavigation();
  const[isLike, setIsLike] = useState(false);
  const onFlatlistUpdate = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
    
  }, []);
  const handleClick = () => {
    
    setIsLike(!isLike);
  }
  return (
    <View style={styles.root}>
      <FlatList
        data={images}
        renderItem={({item}) => (
          <FastImage
            style={styles.image}
            source={{uri: item ,
                headers: { Authorization: 'token' },
                priority: FastImage.priority.high,
                
            }}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={Dimensions.get("screen").width}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        onViewableItemsChanged={onFlatlistUpdate}
      />
      <Pressable 
      style={{margin:20, shadowColor:"black", shadowOpacity:.5, shadowRadius:20, position: 'absolute', top: Platform.OS === "ios" ? 30 : 0, left: 0, 
    height:40, width:40, backgroundColor:"white",
    borderRadius:20, justifyContent:'center', alignItems:"center"}}
      onPress={() => navigation.goBack()}>
      <Fontisto name="angle-left" size={15}  style={{color:'black',}}/> 
    </Pressable>
    <Pressable 
      style={{margin:20, shadowColor:"black", shadowOpacity:.5, shadowRadius:20 ,position: 'absolute', top: Platform.OS === "ios" ? 30 : 0, right: 0, 
    height:40, width:40, backgroundColor:"white",
    borderRadius:20, justifyContent:'center', alignItems:"center"}}
      onPress={handleClick}>
      <Fontisto name="heart" size={15}  color={isLike ? "deeppink" : "dimgrey"}/> 
    </Pressable>
    <View style={{opacity:.7,marginHorizontal:20,position:'absolute',right:0,bottom:Platform.OS === 'android' ? 25: 40,borderRadius:10,flex:1,alignItems:'center',backgroundColor:'black', width:60,}}>
      <Text style={{margin:5,color:'white',fontSize:15, fontWeight:'bold'}}>{activeIndex+1}/{images.length}</Text>
    </View>
    

      <View style={styles.dots}>
      
        {/* {images.map((image, index) => (
          // <View
          //   style={[
          //     styles.dot,
          //     {
          //       backgroundColor: index === activeIndex ? 'blue' : 'white',
          //       borderRadius: index === activeIndex ? 5 : 3,
          //       width: index === activeIndex ? 10 : 6,
          //       height: index === activeIndex ? 10 : 6,
          //       aspectRatio: index === activeIndex ? 1.2 : 1,
                
                
          //     },
          //   ]}
          // />
          
        ))} */}
          
          <PaginationDot
            activeDotColor={'#FF007F'}
            curPage={activeIndex}
            maxPage={images.length}
            sizeRatio={1}
            

            />
          
            
            
            
            
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  image: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get('screen').height / 2.5,
    resizeMode: 'cover',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf:'center',
    alignContent:'center',
    backgroundColor:  'transparent',
    opacity:1,
    elevation:3,
    
    
    
    
  },
  dot: {
    
    
    borderWidth: 1,
    backgroundColor: 'yellow',
    borderColor: 'black',
    margin: 5,
  },
});

export default ImageCarousel;