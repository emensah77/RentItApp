const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const {
    nextToken,
    limit,
    postId,
    price,
    titleHouses,
    homeStatus,
    loyaltyProgram,
    locality,
    subLocality,
    available,
  } = event;

  const filterExpressions = [];
  const expressionAttributeValues = {};

  if (postId) {
    filterExpressions.push('id = :postId');
    expressionAttributeValues[':postId'] = postId;
  }

  // Add other filter conditions similarly
  // ...

  const params = {
    TableName: 'Post-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
    FilterExpression: filterExpressions.join(' AND '),
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit || 100,
    ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
  };

  try {
    const result = await dynamoDB.scan(params).promise();

    // Prepare the response object
    const response = {
      items: result.Items,
      nextToken: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE,PATCH,HEAD,CONNECT,TRACE',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,PUT,DELETE,PATCH,HEAD,CONNECT,TRACE',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
      },
      body: JSON.stringify({ message: 'Error fetching items' }),
    };
  }
};
