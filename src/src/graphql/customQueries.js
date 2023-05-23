export const getUserHomes = /* GraphQL */ `
  query getUser($id: ID!) {
    getUser(id: $id) {
      id
      email
      createdAt
      posts(limit: 10000000) {
        items {
          id
          image
          images
          type
          title
          description
          mode
          phoneNumbers
          bed
          bedroom
          bathroomNumber
          maxGuests
          wifi
          kitchen
          bathroom
          water
          toilet
          aircondition
          locality
          sublocality
          status
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
          userID
          reviews(sortDirection: DESC, limit: 25) {
            items {
              createdAt
              id
              postId
              rating
              review
              updatedAt
              userID
            }
          }
        }
      }
      username
      imageuri
    }
  }
`;
