export {default} from './MyHomesItemScreen';
// import {API, graphqlOperation} from 'aws-amplify';
// import React, {useContext, useEffect, useState} from 'react';
// import {
//   ActivityIndicator,
//   Button,
//   FlatList,
//   TouchableOpacity,
//   StatusBar,
//   View,
//   Text,
//   StyleSheet,
//   Platform,
// } from 'react-native';

// import LinearGradient from 'react-native-linear-gradient';
// import {useNavigation} from '@react-navigation/native';
// import {getUserHomes} from '../../graphql/customQueries';
// import {AuthContext} from '../../navigation/AuthProvider';
// import Post from '../../components/Post';

// const MyHomes = () => {
//   const {user} = useContext(AuthContext);
//   const navigation = useNavigation();

//   const [loading, setLoading] = useState(false);
//   const [posts, setPosts] = useState();

//   const fetchUserHome = async () => {
//     console.log(user?.uid);
//     try {
//       setLoading(true);
//       const result = await API.graphql(
//         graphqlOperation(getUserHomes, {
//           id: user?.uid,
//         }),
//       );
//       setPosts(result?.data?.getUser?.posts?.items);
//       setLoading(false);
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   useEffect(() => {
//     fetchUserHome();
//   }, [user]);

//   const renderItem = ({item, index}) => (
//     <View key={item}>
//       <Post post={item} />
//       <View
//         style={{
//           marginTop: -50,
//           margin: 20,
//           flex: 1,
//           flexDirection: 'row',
//           justifyContent: 'flex-end',
//         }}>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('EditHome', {homeInfo: item})}
//           style={{
//             borderWidth: 5,
//             borderColor: 'blue',
//             backgroundColor: 'blue',
//             borderRadius: 10,
//           }}>
//           <Text
//             style={{
//               fontSize: 17,
//               fontFamily: 'Montserrat-Bold',
//               color: 'white',
//             }}>
//             Edit
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderLoader = () =>
//     loading ? (
//       <View style={{marginVertical: 100, alignItems: 'center'}}>
//         <ActivityIndicator size="large" color="blue" />
//       </View>
//     ) : (
//       <Text style={{alignSelf: 'center', fontSize: 17, fontWeight: 'bold'}}>
//         Yay! you have seen it all
//       </Text>
//     );

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden />
//       <LinearGradient
//         colors={['purple', 'deeppink']}
//         start={{x: 0.1, y: 0.2}}
//         end={{x: 1, y: 0.5}}
//         style={[
//           {
//             backgroundColor: 'blue',
//             height: '15%',
//             borderBottomLeftRadius: 20,
//             borderBottomRightRadius: 20,
//             paddingHorizontal: 20,
//             justifyContent: 'center',
//           },
//         ]}>
//         <View
//           style={{
//             flexDirection: 'row',
//             alignItems: 'center',
//             marginTop: Platform.OS === 'ios' ? 50 : 25,
//             width: '100%',
//           }}>
//           <View style={{flex: 1, alignItems: 'center'}}>
//             <Text
//               style={{
//                 fontSize: 24,
//                 color: '#fff',
//                 fontWeight: 'bold',
//               }}>
//               My Homes
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <View style={{padding: 0, flex: 1}}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'white',
//           }}>
//           {loading ? (
//             <View style={{marginVertical: 100, alignItems: 'center'}}>
//               <ActivityIndicator size="large" color="deeppink" />
//             </View>
//           ) : posts?.length !== 0 ? (
//             <View style={{flex: 1}}>
//               <FlatList
//                 removeClippedSubviews
//                 data={posts}
//                 maxToRenderPerBatch={1}
//                 initialNumToRender={1}
//                 contentContainerStyle={{paddingBottom: 40}}
//                 keyExtractor={(item, index) => index.toString()}
//                 getItemLayout={(data, index) => ({
//                   length: 380,
//                   offset: 380 * index,
//                   index,
//                 })}
//                 renderItem={renderItem}
//                 onEndReachedThreshold={0}
//                 ListFooterComponent={renderLoader}
//                 windowSize={3}
//                 updateCellsBatchingPeriod={100}
//               />
//             </View>
//           ) : (
//             <View style={{marginVertical: 100, alignItems: 'center'}}>
//               <Text style={{fontSize: 18, color: 'blue', fontWeight: 'bold'}}>
//                 No Homes Found
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   label: {
//     marginBottom: 8,
//     fontSize: 12,
//     fontWeight: '600',
//     color: 'blue',
//   },
//   labelMargin: {
//     marginTop: 24,
//     marginBottom: 8,
//     fontSize: 12,
//     fontWeight: '400',
//   },
//   input: {
//     height: 40,
//     marginBottom: 16,
//     backgroundColor: '#DAE3F0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     color: 'black',
//   },
// });

// export default MyHomes;
