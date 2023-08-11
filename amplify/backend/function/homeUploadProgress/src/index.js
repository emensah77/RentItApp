const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const httpMethod = event.requestContext.http.method;
  const queryStringParameters = event.queryStringParameters || {};
  const body = JSON.parse(event.body || '{}');

  const userId = queryStringParameters.userId || body.userId;
  const { progress } = body;
  const action = queryStringParameters.action || body.action;

  if (httpMethod === 'POST') {
    if (action === 'clear') {
      await clearProgressData(userId);
    } else {
      await saveProgress(userId, progress);
    }
  } else if (httpMethod === 'GET') {
    return await loadProgress(userId);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success' }),
  };
};

async function saveProgress(userId, progress) {
  const getItemParams = {
    TableName: 'homeUploadProgress',
    Key: { userId },
  };

  const item = await dynamoDb.get(getItemParams).promise();

  if (item && item.Item) {
    const mergedProgressData = {
      ...item.Item.progressData,
      ...progress.progressData,
    };

    const updateParams = {
      TableName: 'homeUploadProgress',
      Key: { userId },
      UpdateExpression: 'SET #screenName = :screenName, #progressData = :progressData',
      ExpressionAttributeNames: {
        '#screenName': 'screenName',
        '#progressData': 'progressData',
      },
      ExpressionAttributeValues: {
        ':screenName': progress.screenName,
        ':progressData': mergedProgressData,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDb.update(updateParams).promise();
  } else {
    const putParams = {
      TableName: 'homeUploadProgress',
      Item: {
        userId,
        ...progress,
      },
    };

    await dynamoDb.put(putParams).promise();
  }
}

async function clearProgressData(userId) {
  const params = {
    TableName: 'homeUploadProgress',
    Key: { userId },
  };

  try {
    await dynamoDb.delete(params).promise();
    console.log('Progress data cleared successfully for user:', userId);
  } catch (error) {
    console.error(
      'Unable to clear progress data for user:',
      userId,
      '. Error:',
      JSON.stringify(error, null, 2),
    );
  }
}

async function loadProgress(userId) {
  const params = {
    TableName: 'homeUploadProgress',
    Key: { userId },
  };

  const result = await dynamoDb.get(params).promise();
  console.log('result', result);

  if (result.Item) {
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}
