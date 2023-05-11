import React, {useCallback, useMemo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import useVisibility from '../../../hooks/useVisibility';
import useWishlist from '../../../hooks/useWishlist';
import styles2 from '../SecondScreenOfWishlists.styles';
import iconStyle from './WishListCard/WishListCard.styles';
import WishListCarousel from './WishListCarousel';

const Post = ({item}) => {
  const {checkIsFav, handleChangeFavorite} = useWishlist();

  const likeVisiblity = useVisibility(checkIsFav(item.id));

  const onChangeFavorite = useCallback(() => {
    handleChangeFavorite(item);
    likeVisiblity.toggleVisibility();
  }, [handleChangeFavorite, item, likeVisiblity]);

  const currency = useMemo(() => {
    if (item.currency) {
      if (item.currency[0] === 'usd') {
        return '$';
      } else if (item.currency[0] === 'ghs') {
        return 'GH₵';
      } else {
        return 'GH₵';
      }
    } else {
      return 'GH₵';
    }
  }, [item?.currency]);

  const renderCarousel = useCallback(() => <WishListCarousel images={item.images} />, [item]);
  const renderDescription = useCallback(
    () => (
      <View style={[styles2.descriptionContainer, styles2.px24]}>
        <View style={styles2.desRight}>
          {item.locality != null ? (
            <Text style={styles2.desTitle}>
              {item.type} in
              {item.locality}
            </Text>
          ) : (
            <Text style={styles2.desTitle} numberOfLines={2}>
              {item.type} | {item.title}
            </Text>
          )}

          <Text style={styles2.desSubTitle}>
            {item.bedroom > 0 && `${item.bedroom} bedrooms`}
            {item.bathroomNumber > 0 && `| ${item.bathroomNumbe} bathrooms`}
          </Text>

          {item.mode === 'For Sale' ? (
            <Text style={styles2.desSubTitle}>
              {currency}
              {Math.round(item.newPrice * 1.07)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
            </Text>
          ) : (
            <Text style={styles2.desSubTitle}>
              {currency}
              {Math.round((item.newPrice * 1.07) / 12)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
              / month
            </Text>
          )}
        </View>
      </View>
    ),
    [
      currency,
      item.bathroomNumbe,
      item.bathroomNumber,
      item.bedroom,
      item.locality,
      item.mode,
      item.newPrice,
      item.title,
      item.type,
    ],
  );

  const renderStickyHeader = useCallback(
    () => (
      <>
        <View style={styles2.forSale}>
          <Text adjustsFontSizeToFit style={styles2.forSaleText}>
            {item.mode === 'For Sale' ? 'FOR SALE' : 'FOR RENT'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={iconStyle.heartContainer}
          onPress={onChangeFavorite}>
          <Icon
            name="heart"
            size={30}
            style={[iconStyle.heartIcon, likeVisiblity.visible && iconStyle.activeHeart]}
          />
        </TouchableOpacity>
      </>
    ),
    [item.mode, likeVisiblity.visible, onChangeFavorite],
  );

  return (
    <>
      {renderCarousel()}
      {renderStickyHeader()}
      {renderDescription(item)}
    </>
  );
};

export default Post;
