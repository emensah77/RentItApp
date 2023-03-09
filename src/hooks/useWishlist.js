import {useContext} from 'react';
import {WishListContext} from '../context/WishlistContext';

const useWishlist = () => useContext(WishListContext);

export default useWishlist;
