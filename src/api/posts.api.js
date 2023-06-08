import {API, graphqlOperation} from 'aws-amplify';
import {getPost} from '../graphql/queries';

export async function fetchPost_req(id) {
  const postsResult = await API.graphql(
    graphqlOperation(getPost, {
      id,
    }),
  );

  return postsResult?.data?.getPost;
}

export async function fetchSimilarPosts_req(post) {
  const response = await fetch(
    'https://fwftielmqvccpnbbna45skokwe0fgeyk.lambda-url.us-east-2.on.aws/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPrice: post.newPrice,
        bed: post.bedroom,
        locality: post.locality,
        kitchen: post.kitchen,
        aircondition: post.aircondition,
        water: post.water,
        wifi: post.wifi,
        latitude: post.latitude,
        longitude: post.longitude,
        bathroom: post.bathroom,
        mode: post.mode,
        type: post.type,
        id: post.id,
      }),
    },
  );

  return await response.json();
}
