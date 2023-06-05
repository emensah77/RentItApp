const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async event => {
  const requestBody = JSON.parse(event.body);
  const {action} = requestBody;
  const {userId} = requestBody;

  if (action === 'updateWatchStatus') {
    const {videoVersion} = requestBody;
    return await updateWatchStatus(userId, videoVersion);
  }
  if (action === 'fetchVideoUrl') {
    return await fetchVideoUrl(userId);
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Invalid action',
    }),
  };
};

async function updateWatchStatus(userId, videoVersion) {
  const params = {
    TableName: 'inAppVideoMetrics',
    Key: {userId},
    UpdateExpression: 'set hasWatchedVideo = :watched, watchedVideoVersion = :version',
    ExpressionAttributeValues: {
      ':watched': true,
      ':version': videoVersion,
    },
  };

  try {
    await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Watch status updated successfully',
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error updating watch status',
      }),
    };
  }
}

async function fetchVideoUrl(userId) {
  const params = {
    TableName: 'inAppVideoMetrics',
    Key: {userId},
  };

  try {
    const data = await dynamodb.get(params).promise();
    console.log('Data retrieved from DynamoDB:', data);

    if (!data.Item) {
      // Create a new record for the user with hasWatchedVideo set to false
      await createUserRecord(userId);
    }

    const hasWatchedVideo = data.Item && data.Item.hasWatchedVideo;
    const watchedVideoVersion = data.Item && data.Item.watchedVideoVersion;
    const currentVideoVersion = getCurrentVideoVersion();

    if (hasWatchedVideo && watchedVideoVersion === currentVideoVersion) {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'User has already watched the video',
          videoUrl: null,
          videoVersion: currentVideoVersion,
        }),
      };
      console.log('Response:', response);
      return response;
    }
    const videoUrl = getVideoUrl();

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Video URL fetched successfully',
        videoUrl,
        videoVersion: currentVideoVersion,
      }),
    };
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching video URL',
      }),
    };
  }
}

async function createUserRecord(userId) {
  const currentVideoVersion = getCurrentVideoVersion();

  const params = {
    TableName: 'inAppVideoMetrics',
    Item: {
      userId,
      hasWatchedVideo: false,
      watchedVideoVersion: null,
    },
  };

  try {
    await dynamodb.put(params).promise();
  } catch (error) {
    console.error('Error creating user record:', error);
  }
}

function getCurrentVideoVersion() {
  // Replace this with your logic to get the current video version
  return '1.5';
}

function getVideoUrl() {
  // Replace this with your logic to get the current video URL
  return 'https://d1mgzi0ytcdaf9.cloudfront.net/video/rentitinappvideo2.mp4';
}
