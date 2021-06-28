/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      image
      image2
      image3
      image4
      image5
      type
      title
      description
      bed
      bedroom
      maxGuests
      wifi
      kitchen
      bathroom
      water
      toilet
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        image
        image2
        image3
        image4
        image5
        type
        title
        description
        bed
        bedroom
        maxGuests
        wifi
        kitchen
        bathroom
        water
        toilet
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
