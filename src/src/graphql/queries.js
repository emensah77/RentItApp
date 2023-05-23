// this is an auto generated file. This will be overwritten

export const getReview = /* GraphQL */ `
  query GetReview($id: ID!) {
    getReview(id: $id) {
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
export const listReviews = /* GraphQL */ `
  query ListReviews(
    $filter: ModelReviewFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReviews(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        post {
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
        user {
          id
          username
          email
          imageuri
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
      nextToken
    }
  }
`;
export const getViewing = /* GraphQL */ `
  query GetViewing($id: ID!) {
    getViewing(id: $id) {
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
export const listViewings = /* GraphQL */ `
  query ListViewings(
    $filter: ModelViewingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listViewings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPostNew = /* GraphQL */ `
  query GetPostNew($latitude: Float!, $longitude: Float!) {
    getPostNew(latitude: $latitude, longitude: $longitude) {
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
export const listPostNews = /* GraphQL */ `
  query ListPostNews(
    $latitude: Float
    $longitude: ModelFloatKeyConditionInput
    $filter: ModelPostNewFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPostNews(
      latitude: $latitude
      longitude: $longitude
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
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
        oldPrice
        newPrice
        latitude
        longitude
        createdAt
        updatedAt
      }
      nextToken
      scannedCount
      count
    }
  }
`;
export const listPostsSortedByCreatedTime = /* GraphQL */ `
  query ListPostsSortedByCreatedTime(
    $type: String
    $createdTime: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPostsSortedByCreatedTime(
      type: $type
      createdTime: $createdTime
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
