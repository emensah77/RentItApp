// this is an auto generated file. This will be overwritten

export const createPaymentIntent = /* GraphQL */ `
  mutation CreatePaymentIntent($amount: Int!) {
    createPaymentIntent(amount: $amount) {
      clientSecret
    }
  }
`;
export const createReview = /* GraphQL */ `
  mutation CreateReview(
    $input: CreateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    createReview(input: $input, condition: $condition) {
      id
      post {
        id
        createdTime
        updatedTime
        userID
        user {
          id
          username
          email
          imageuri
          createdAt
          updatedAt
        }
        reviews {
          nextToken
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
        status
        availabilityDate
        homeownerName
        negotiable
        furnished
        loyaltyProgram
        verified
        available
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
        videoUrl
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      postId
      userID
      rating
      review
      parentReviewId
      createdAt
      updatedAt
    }
  }
`;
export const updateReview = /* GraphQL */ `
  mutation UpdateReview(
    $input: UpdateReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    updateReview(input: $input, condition: $condition) {
      id
      post {
        id
        createdTime
        updatedTime
        userID
        user {
          id
          username
          email
          imageuri
          createdAt
          updatedAt
        }
        reviews {
          nextToken
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
        status
        availabilityDate
        homeownerName
        negotiable
        furnished
        loyaltyProgram
        verified
        available
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
        videoUrl
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      postId
      userID
      rating
      review
      parentReviewId
      createdAt
      updatedAt
    }
  }
`;
export const deleteReview = /* GraphQL */ `
  mutation DeleteReview(
    $input: DeleteReviewInput!
    $condition: ModelReviewConditionInput
  ) {
    deleteReview(input: $input, condition: $condition) {
      id
      post {
        id
        createdTime
        updatedTime
        userID
        user {
          id
          username
          email
          imageuri
          createdAt
          updatedAt
        }
        reviews {
          nextToken
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
        status
        availabilityDate
        homeownerName
        negotiable
        furnished
        loyaltyProgram
        verified
        available
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
        videoUrl
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      postId
      userID
      rating
      review
      parentReviewId
      createdAt
      updatedAt
    }
  }
`;
export const createViewing = /* GraphQL */ `
  mutation CreateViewing(
    $input: CreateViewingInput!
    $condition: ModelViewingConditionInput
  ) {
    createViewing(input: $input, condition: $condition) {
      id
      postId
      username
      viewingDate
      viewingTime
      usercontact
      userlocation
      viewingDateTime
      userId
      status
      assignedRep
      comments
      createdAt
      updatedAt
    }
  }
`;
export const updateViewing = /* GraphQL */ `
  mutation UpdateViewing(
    $input: UpdateViewingInput!
    $condition: ModelViewingConditionInput
  ) {
    updateViewing(input: $input, condition: $condition) {
      id
      postId
      username
      viewingDate
      viewingTime
      usercontact
      userlocation
      viewingDateTime
      userId
      status
      assignedRep
      comments
      createdAt
      updatedAt
    }
  }
`;
export const deleteViewing = /* GraphQL */ `
  mutation DeleteViewing(
    $input: DeleteViewingInput!
    $condition: ModelViewingConditionInput
  ) {
    deleteViewing(input: $input, condition: $condition) {
      id
      postId
      username
      viewingDate
      viewingTime
      usercontact
      userlocation
      viewingDateTime
      userId
      status
      assignedRep
      comments
      createdAt
      updatedAt
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
          createdTime
          updatedTime
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
          status
          availabilityDate
          homeownerName
          negotiable
          furnished
          loyaltyProgram
          verified
          available
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
          videoUrl
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
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
          createdTime
          updatedTime
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
          status
          availabilityDate
          homeownerName
          negotiable
          furnished
          loyaltyProgram
          verified
          available
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
          videoUrl
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
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
          createdTime
          updatedTime
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
          status
          availabilityDate
          homeownerName
          negotiable
          furnished
          loyaltyProgram
          verified
          available
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
          videoUrl
          oldPrice
          newPrice
          latitude
          longitude
          createdAt
          updatedAt
        }
        nextToken
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
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
      createdTime
      updatedTime
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
          createdAt
          updatedAt
        }
        nextToken
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
      status
      availabilityDate
      homeownerName
      negotiable
      furnished
      loyaltyProgram
      verified
      available
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
      videoUrl
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
      createdTime
      updatedTime
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
          createdAt
          updatedAt
        }
        nextToken
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
      status
      availabilityDate
      homeownerName
      negotiable
      furnished
      loyaltyProgram
      verified
      available
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
      videoUrl
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
      createdTime
      updatedTime
      userID
      user {
        id
        username
        email
        imageuri
        posts {
          nextToken
        }
        reviews {
          nextToken
        }
        createdAt
        updatedAt
      }
      reviews {
        items {
          id
          postId
          userID
          rating
          review
          parentReviewId
          createdAt
          updatedAt
        }
        nextToken
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
      status
      availabilityDate
      homeownerName
      negotiable
      furnished
      loyaltyProgram
      verified
      available
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
      videoUrl
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
