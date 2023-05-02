import React, {createContext, useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import FirebaseRepo from '../repositry/FirebaseRepo';

const WishListContext = createContext({
  favorite: {},
  handleChangeFavorite: () => {},
  checkIsFav: () => {},
});

function WishListProvider({children}) {
  const user = auth().currentUser;
  const [favorite, setFavorite] = useState({});

  let rand = '';

  const fetchWishlist = async () => {
    const wishList = await FirebaseRepo.getWishlist(user?.uid);
    const temp = {};
    wishList?.map(single => {
      temp[single.id] = true;
      return null;
    });
    setFavorite(temp);
  };

  useEffect(() => {
    if (!user || user.uid === undefined) {
      setFavorite({});
      return;
    }
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToFavorites = async post => {
    const randomString = (Math.random() * 1e32).toString(36);
    rand = randomString;
    await FirebaseRepo.addToFavorites(rand, randomString, user, post);
  };

  const handleChangeFavorite = async post => {
    if (!user.uid) {
      return;
    }
    if (!favorite[post.id]) {
      setFavorite({...favorite, [post.id]: true});
      addToFavorites(post);
    } else {
      await FirebaseRepo.removeFromFavorites(post?.id);
      setFavorite({...favorite, [post.id]: false});
    }
  };

  const checkIsFav = homeId => favorite[homeId];

  return (
    <WishListContext.Provider
      value={{
        favorite,
        handleChangeFavorite,
        checkIsFav,
      }}>
      {children}
    </WishListContext.Provider>
  );
}

export {WishListProvider, WishListContext};
