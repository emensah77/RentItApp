/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateReview = /* GraphQL */ `
  subscription OnCreateReview {
    onCreateReview {
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
        idUrls
        amenities
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
        qualityScore
        qualityListing
        dataAccuracy
        responsiveness
        rentersFeedback
        address
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
export const onUpdateReview = /* GraphQL */ `
  subscription OnUpdateReview {
    onUpdateReview {
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
        idUrls
        amenities
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
        qualityScore
        qualityListing
        dataAccuracy
        responsiveness
        rentersFeedback
        address
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
export const onDeleteReview = /* GraphQL */ `
  subscription OnDeleteReview {
    onDeleteReview {
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
        idUrls
        amenities
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
        qualityScore
        qualityListing
        dataAccuracy
        responsiveness
        rentersFeedback
        address
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
export const onCreateViewing = /* GraphQL */ `
  subscription OnCreateViewing {
    onCreateViewing {
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
      comments {
        items {
          id
          content
          author
          createdAt
          updatedAt
          viewingId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateViewing = /* GraphQL */ `
  subscription OnUpdateViewing {
    onUpdateViewing {
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
      comments {
        items {
          id
          content
          author
          createdAt
          updatedAt
          viewingId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteViewing = /* GraphQL */ `
  subscription OnDeleteViewing {
    onDeleteViewing {
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
      comments {
        items {
          id
          content
          author
          createdAt
          updatedAt
          viewingId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
      id
      content
      author
      createdAt
      updatedAt
      viewing {
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
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      viewingId
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
      id
      content
      author
      createdAt
      updatedAt
      viewing {
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
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      viewingId
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
      id
      content
      author
      createdAt
      updatedAt
      viewing {
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
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      viewingId
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
          idUrls
          amenities
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
          qualityScore
          qualityListing
          dataAccuracy
          responsiveness
          rentersFeedback
          address
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
          idUrls
          amenities
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
          qualityScore
          qualityListing
          dataAccuracy
          responsiveness
          rentersFeedback
          address
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
          idUrls
          amenities
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
          qualityScore
          qualityListing
          dataAccuracy
          responsiveness
          rentersFeedback
          address
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost {
    onCreatePost {
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
      idUrls
      amenities
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
      qualityScore
      qualityListing
      dataAccuracy
      responsiveness
      rentersFeedback
      address
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost {
    onUpdatePost {
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
      idUrls
      amenities
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
      qualityScore
      qualityListing
      dataAccuracy
      responsiveness
      rentersFeedback
      address
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost {
    onDeletePost {
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
      idUrls
      amenities
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
      qualityScore
      qualityListing
      dataAccuracy
      responsiveness
      rentersFeedback
      address
      oldPrice
      newPrice
      latitude
      longitude
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePostNew = /* GraphQL */ `
  subscription OnCreatePostNew {
    onCreatePostNew {
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
export const onUpdatePostNew = /* GraphQL */ `
  subscription OnUpdatePostNew {
    onUpdatePostNew {
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
export const onDeletePostNew = /* GraphQL */ `
  subscription OnDeletePostNew {
    onDeletePostNew {
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
