const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const { action, assignedRep } = JSON.parse(event.body);

  let params;

  if (action === 'fetchByAssignedRep') {
    params = {
      TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
      FilterExpression: 'assignedRep = :assignedRep',
      ExpressionAttributeValues: { ':assignedRep': assignedRep },
    };
  } else if (action === 'fetchAllWithoutAssignedRep') {
    params = {
      TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
      FilterExpression: 'attribute_not_exists(assignedRep)',
    };
  }

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        viewings: result.Items,
      }),
    };
  } catch (error) {
    console.error('Error fetching viewings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while fetching viewings.',
      }),
    };
  }
};
