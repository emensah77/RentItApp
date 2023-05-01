import firestore from '@react-native-firebase/firestore';

class FirbaseRepo {
  async getWishlist(id) {
    try {
      const favorite = [];
      await firestore()
        .collection('posts')
        //   @ts-ignore
        .where('userId', '==', id)
        .get()
        .then(querySnapshot =>
          querySnapshot.forEach(doc => {
            const {
              userId,
              image,
              type,
              title,
              description,
              bed,
              bedroom,
              maxGuests,
              wifi,
              kitchen,
              bathroom,
              water,
              toilet,
              images,

              oldPrice,
              newPrice,
              latitude,
              longitude,
              id,
            } = doc.data();

            favorite.push({
              userId,
              image,
              type,
              title,
              description,

              bed,
              bedroom,
              maxGuests,
              wifi,
              kitchen,
              bathroom,
              water,
              toilet,
              images,

              oldPrice,
              newPrice,
              latitude,
              longitude,
              id,
            });
          }),
        );
      return favorite;
    } catch (error) {
      console.log(error);
    }
  }

  //   to add the favorites
  addToFavorites = async (rand, randomString, user, post) => {
    try {
      await firestore().collection('posts').doc(rand).set({
        userId: user?.uid,
        image: post.image,
        type: post.type,
        title: post.title,
        description: post.description,
        randString: randomString,

        bed: post.bed,
        bedroom: post.bedroom,
        maxGuests: post.maxGuests,
        wifi: post.wifi,
        kitchen: post.kitchen,
        bathroom: post.bathroom,
        water: post.water,
        toilet: post.toilet,
        images: post.images,

        oldPrice: post.oldPrice,
        newPrice: post.newPrice,
        // count: counter,
        liked: false,
        latitude: post.latitude,
        longitude: post.longitude,
        id: post.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  removeFromFavorites = async id => {
    try {
      await firestore()
        .collection('posts')
        .where('id', '==', id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            firestore()
              .collection('posts')
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Removed from wishlist posts!');
              });
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
}
export default new FirbaseRepo();
