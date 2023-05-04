import auth from '@react-native-firebase/auth';
import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import FirebaseRepo from '../repositry/FirebaseRepo';

const WishListContext = createContext({
  favorite: {},
  handleChangeFavorite: () => {},
  checkIsFav: () => {},
});

function WishListProvider({children}) {
  const user = useMemo(() => auth().currentUser || {}, []);
  const [favorite, setFavorite] = useState({});

  const fetchWishlist = useCallback(async () => {
    const wishList = await FirebaseRepo.getWishlist(user?.uid);

    if (wishList.length) {
      setFavorite(() =>
        wishList.reduce(
          (sum, item) => ({
            ...sum,
            [item.id]: true,
          }),
          {},
        ),
      );
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.uid === undefined) {
      setFavorite({});
      return;
    }
    fetchWishlist();
  }, [fetchWishlist, user]);

  const addToFavorites = useCallback(
    async post => {
      const randomString = (Math.random() * 1e32).toString(36);
      await FirebaseRepo.addToFavorites(randomString, randomString, user, post);
    },
    [user],
  );

  const handleChangeFavorite = useCallback(
    async post => {
      if (!user.uid) {
        return;
      }
      if (!favorite[post.id]) {
        setFavorite(() => ({...favorite, [post.id]: true}));
        addToFavorites(post);
      } else {
        await FirebaseRepo.removeFromFavorites(post?.id);
        setFavorite(() => ({...favorite, [post.id]: false}));
      }
    },
    [addToFavorites, favorite, user?.uid],
  );

  const checkIsFav = useCallback(homeId => favorite[homeId], [favorite]);

  const providerValues = useMemo(
    () => ({
      favorite,
      handleChangeFavorite,
      checkIsFav,
    }),
    [checkIsFav, favorite, handleChangeFavorite],
  );

  return <WishListContext.Provider value={providerValues}>{children}</WishListContext.Provider>;
}

export {WishListProvider, WishListContext};
