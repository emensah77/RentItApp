const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: '2018-11-29',
  endpoint: 'https://97lnj6qe60.execute-api.us-east-2.amazonaws.com/production',
});

exports.handler = async event => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  const {routeKey} = event.requestContext;

  let action;
  if (routeKey === '$connect') {
    action = 'connect';
  } else if (routeKey === '$disconnect') {
    action = 'disconnect';
  } else {
    const body = JSON.parse(event.body);
    action = body.action;
  }

  switch (action) {
    case 'locationUpdate':
      return await handleLocationUpdate(event);
    case 'connect':
      return await handleConnect(event);
    case 'disconnect':
      return await handleDisconnect(event);
    default:
      console.error('No matching action found');
      return {statusCode: 400};
  }
};

async function handleConnect(event) {
  const {connectionId} = event.requestContext;

  const params = {
    TableName: 'WebSocketConnections',
    Item: {connectionId},
  };

  try {
    await dynamodb.put(params).promise();
    return {statusCode: 200};
  } catch (error) {
    console.error('Error storing connection:', error);
    return {statusCode: 500};
  }
}

async function handleDisconnect(event) {
  const {connectionId} = event.requestContext;

  const params = {
    TableName: 'WebSocketConnections',
    Key: {connectionId},
  };

  try {
    await dynamodb.delete(params).promise();
    return {statusCode: 200};
  } catch (error) {
    console.error('Error removing connection:', error);
    return {statusCode: 500};
  }
}

async function handleLocationUpdate(event) {
  const body = JSON.parse(event.body);
  const {marketerId} = body.data; // Extract marketerId from data
  const {marketerStatus} = body.data; // Extract marketerStatus from data
  const {location} = body.data; // Extract location from data
  const {latitude, longitude} = location; // Extract latitude and longitude

  const params = {
    TableName: 'MarketerLocations',
    Item: {
      marketerId,
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      marketerStatus, // Assuming marketerStatus is part of the input, if not, you can remove this line
    },
  };

  try {
    await dynamodb.put(params).promise();

    const connections = await getAllConnections();

    await broadcastUpdate(connections, body);

    return {statusCode: 200, body: 'Location update successful'};
  } catch (error) {
    console.error('Error updating location:', error);
    return {statusCode: 500, body: 'Error updating location'};
  }
}

async function broadcastUpdate(connections, data) {
  const postCalls = connections.map(async ({connectionId}) => {
    try {
      await apigwManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify(data),
        })
        .promise();
    } catch (err) {
      if (err.statusCode === 410) {
        console.log(`Found stale connection, deleting ${connectionId}`);
        await dynamodb
          .delete({
            TableName: 'WebSocketConnections',
            Key: {connectionId},
          })
          .promise();
      } else {
        console.error('Failed to post. Error:', JSON.stringify(err));
      }
    }
  });

  return Promise.all(postCalls);
}

async function getAllConnections() {
  const scanParams = {
    TableName: 'WebSocketConnections',
  };

  try {
    const scanResults = await dynamodb.scan(scanParams).promise();
    return scanResults.Items;
  } catch (error) {
    console.error('Error fetching connections:', error);
    throw error;
  }
}
