/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPaymentIntent = /* GraphQL */ `
  mutation CreatePaymentIntent($amount: Int!) {
    createPaymentIntent(amount: $amount) {
      clientSecret
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      email
      imageuri
      posts {
        items {
          id
          userID
          image
          images
          type
          title
          description
          mode
          phoneNumbers
          marketerNumber
          currency
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
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      imageuri
      posts {
        items {
          id
          userID
          image
          images
          type
          title
          description
          mode
          phoneNumbers
          marketerNumber
          currency
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
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      imageuri
      posts {
        items {
          id
          userID
          image
          images
          type
          title
          description
          mode
          phoneNumbers
          marketerNumber
          currency
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
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost(
    $input: CreatePostInput!
    $condition: ModelPostConditionInput
  ) {
    createPost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      image
      images
      type
      title
      description
      mode
      phoneNumbers
      marketerNumber
      currency
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const updatePost = /* GraphQL */ `
  mutation UpdatePost(
    $input: UpdatePostInput!
    $condition: ModelPostConditionInput
  ) {
    updatePost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      image
      images
      type
      title
      description
      mode
      phoneNumbers
      marketerNumber
      currency
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const deletePost = /* GraphQL */ `
  mutation DeletePost(
    $input: DeletePostInput!
    $condition: ModelPostConditionInput
  ) {
    deletePost(input: $input, condition: $condition) {
      id
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        createdAt
        updatedAt
      }
      image
      images
      type
      title
      description
      mode
      phoneNumbers
      marketerNumber
      currency
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const createPostNew = /* GraphQL */ `
  mutation CreatePostNew(
    $input: CreatePostNewInput!
    $condition: ModelPostNewConditionInput
  ) {
    createPostNew(input: $input, condition: $condition) {
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const updatePostNew = /* GraphQL */ `
  mutation UpdatePostNew(
    $input: UpdatePostNewInput!
    $condition: ModelPostNewConditionInput
  ) {
    updatePostNew(input: $input, condition: $condition) {
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const deletePostNew = /* GraphQL */ `
  mutation DeletePostNew(
    $input: DeletePostNewInput!
    $condition: ModelPostNewConditionInput
  ) {
    deletePostNew(input: $input, condition: $condition) {
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
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
