/* eslint-disable no-dupe-keys */
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const SUPER_USER_ID = 'UWHvpJ1XoObsFYTFR48zYe6jscJ2'; // Replace with your super user's ID
const miniSuperUserLocalities = {
  wRSyTWe2WMPM44PhI4gp5p5Kapg1: 'Greater Accra',
  omdT6zOzOoVL9YQarlIklkTeEGQ2: 'Ashanti',
  HHlhY30NQzRYkyTkkkIVumS9Pk42: 'Eastern',
  qqNXZSXjGRXoysz1j021y2io5ZO2: 'Upper West',
  ChDf3VW1BBcvIWCmptuKq211kiu2: 'Western North',
  wlE3aLGQ7YZCRgXQTZLvzV2JRzw2: 'Bono',
  wlE3aLGQ7YZCRgXQTZLvzV2JRzw2: 'Bono East',
  wlE3aLGQ7YZCRgXQTZLvzV2JRzw2: 'Ahafo',
  AhNRlBDbdcPbl2u8rWGtn11jslA2: 'Central',
  cGKbewQLzpSC7SydQLPp9qxCGCq1: 'Bono',
  ti51nIREVsbxQR4vRfhkQI3Xu8T2: 'Ashanti',
  LcmKAonWk3QYpE7m6X0Lx2xsfd52: 'Volta',
  b8nofL2K1DRRrg0wse91VmJnHmR2: 'Volta',
  '41Zzeh65qMdST6ZbrqK8iuSsoXd2': 'Eastern',

  // more mini super users and their localities
};

async function getHomesByOwner(homeownerName) {
  const params = {
    TableName: 'UnverifiedHomes',
    IndexName: 'homeownerName-index', // This would need to be the name of your new index
    KeyConditionExpression: '#hn = :homeownerName',
    ExpressionAttributeNames: {
      '#hn': 'homeownerName',
    },
    ExpressionAttributeValues: {
      ':homeownerName': homeownerName,
    },
  };

  try {
    const data = await dynamodb.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error(`Error fetching homes for homeowner ${homeownerName}:`, error);
    throw error;
  }
}

async function getHomeStats(userId, startTime, endTime) {
  console.log(`Fetching home stats for user ${userId} between ${startTime} and ${endTime}...`);

  const statuses = ['pending', 'approved', 'rejected'];
  const stats = {};

  for (const status of statuses) {
    let params = {};

    if (userId === SUPER_USER_ID) {
      params = {
        TableName: 'UnverifiedHomes',
        IndexName: 'status-updatedTime-index',
        KeyConditionExpression: '#st = :status and #upTime between :startTime and :endTime',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#upTime': 'updatedTime',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':startTime': startTime,
          ':endTime': endTime,
        },
      };
    } else if (userId in miniSuperUserLocalities) {
      params = {
        TableName: 'UnverifiedHomes',
        IndexName: 'status-updatedTime-index',
        KeyConditionExpression: '#st = :status and #upTime between :startTime and :endTime',
        FilterExpression: '#loc = :locality',
        ExpressionAttributeNames: {
          '#st': 'status',
          '#upTime': 'updatedTime',
          '#loc': 'locality',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':startTime': startTime,
          ':endTime': endTime,
          ':locality': miniSuperUserLocalities[userId],
        },
      };
    } else {
      params = {
        TableName: 'UnverifiedHomes',
        IndexName: 'updatedBy-status-index',
        KeyConditionExpression: 'updatedBy = :updatedBy and #st = :status',
        FilterExpression: 'updatedTime between :startTime and :endTime',
        ExpressionAttributeNames: {
          '#st': 'status',
        },
        ExpressionAttributeValues: {
          ':updatedBy': userId,
          ':status': status,
          ':startTime': startTime,
          ':endTime': endTime,
        },
      };
    }

    try {
      const data = await dynamodb.query(params).promise();
      console.log(`Fetched ${status} homes for user ${userId}:`, data.Items);
      stats[status] = { count: data.Items.length, homes: data.Items };
    } catch (error) {
      console.error(`Error fetching ${status} homes for user ${userId}:`, error);
      throw error; // Re-throw the error to stop execution and propagate it up the call stack
    }
  }

  console.log(`Fetched home stats for user ${userId}:`, stats);

  return stats;
}

async function updateItem(key, updateValues, userId) {
  let updateExpression = 'set ';
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  // Iterate through each key in updateValues
  for (const field in updateValues) {
    updateExpression += `#${field} = :${field},`;
    expressionAttributeNames[`#${field}`] = field;
    expressionAttributeValues[`:${field}`] = updateValues[field];
  }

  // Add updatedBy and updatedAt to the update expression
  updateExpression += '#updatedBy = :updatedBy, #updatedTime = :updatedTime';
  expressionAttributeNames['#updatedBy'] = 'updatedBy';
  expressionAttributeNames['#updatedTime'] = 'updatedTime';
  expressionAttributeValues[':updatedBy'] = userId;
  expressionAttributeValues[':updatedTime'] = new Date().toISOString(); // Current time in Unix epoch format

  // Remove trailing comma
  updateExpression = updateExpression.trim().endsWith(',')
    ? updateExpression.trim().slice(0, -1)
    : updateExpression.trim();

  const params = {
    TableName: 'UnverifiedHomes',
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  const response = await dynamodb.update(params).promise();

  return response.Attributes;
}

async function addComment(commentDetails) {
  // Generate a new UUID for the comment
  const commentId = uuid.v4();

  const params = {
    TableName: 'homeComments',
    Item: {
      ...commentDetails,
      commentId,
    },
  };

  try {
    await dynamodb.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}

async function fetchComments(homeId) {
  const params = {
    TableName: 'homeComments',
    KeyConditionExpression: 'homeId = :homeId',
    ExpressionAttributeValues: {
      ':homeId': homeId,
    },
  };

  try {
    const data = await dynamodb.query(params).promise();
    return { statusCode: 200, body: JSON.stringify(data.Items) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
}

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const { httpMethod } = event;
  const { path } = event;

  if (httpMethod === 'POST' && path.endsWith('/demands')) {
    const demandDetails = JSON.parse(event.body);
    const newDemand = await createDemand(demandDetails);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(newDemand),
    };
  }

  if (httpMethod === 'POST' && path.endsWith('/marketerrequest')) {
    const requestDetails = JSON.parse(event.body);
    const requestDetail = await createMarketerRequest(requestDetails);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(requestDetail),
    };
  }

  if (httpMethod === 'POST' && path.endsWith('/reports')) {
    const requestDetails = JSON.parse(event.body);
    const requestDetail = await createEmployeeReport(requestDetails);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(requestDetail),
    };
  }

  if (httpMethod === 'GET' && path.endsWith('/marketerrequest')) {
      // Extract query string parameters from the event
      const marketerID = event.queryStringParameters.marketerID;
      const startDate = event.queryStringParameters.startDate;
      const endDate = event.queryStringParameters.endDate;

      // Check if marketerID is provided, since it's mandatory
      if (!marketerID) {
          return {
              statusCode: 400,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ message: 'marketerID is required.' }),
          };
      }

      try {
          const requests = await retrieveMarketerRequests(marketerID, startDate, endDate);

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'OPTIONS,GET',
              },
              body: JSON.stringify(requests),
          };
      } catch (error) {
          console.error('Error retrieving marketer requests:', error);
          return {
              statusCode: 500,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ message: 'Failed to retrieve marketer requests.' }),
          };
      }
  }

  if (httpMethod === 'GET' && path.endsWith('/reports')) {
      // Extract query string parameters from the event
      const employeeID = event.queryStringParameters.marketerID;
      const startDate = event.queryStringParameters.startDate;
      const endDate = event.queryStringParameters.endDate;

      // Check if marketerID is provided, since it's mandatory
      if (!employeeID) {
          return {
              statusCode: 400,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ message: 'marketerID is required.' }),
          };
      }

      try {
          const requests = await retrieveEmployeeReports(employeeID, startDate, endDate);

          return {
              statusCode: 200,
              headers: {
                  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': 'OPTIONS,GET',
              },
              body: JSON.stringify(requests),
          };
      } catch (error) {
          console.error('Error retrieving marketer requests:', error);
          return {
              statusCode: 500,
              headers: {
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({ message: 'Failed to retrieve marketer requests.' }),
          };
      }
    }


  if (httpMethod === 'GET' && path.endsWith('/demands')) {
    const { locality, sublocality, pageSize } = event.queryStringParameters;

    const demand = await fetchDemands(
      locality,
      sublocality,
      pageSize ? parseInt(pageSize) : undefined,
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: JSON.stringify(demand),
    };
  }

  if (httpMethod === 'POST' && path.endsWith('/claim')) {
    const { marketerId, DemandId } = JSON.parse(event.body); // Note the changed variable names
    const claimedDemand = await claimDemand(DemandId, marketerId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(claimedDemand),
    };
  }

  if (httpMethod === 'POST' && path.endsWith('/claimedDemands')) {
    const { updaterId, demandId, details } = JSON.parse(event.body); // Note the changed variable names
    const updatedDemand = await updateDemand(demandId, details, updaterId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(updatedDemand),
    };
  }

  if (httpMethod === 'POST' && path.endsWith('/comments')) {
    const commentDetails = JSON.parse(event.body);
    const newComment = await addComment(commentDetails);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify(newComment),
    };
  }
  if (httpMethod === 'GET' && path.endsWith('/comments')) {
    const { homeId } = event.queryStringParameters;
    const comments = await fetchComments(homeId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: JSON.stringify(comments),
    };
  }

  if (httpMethod === 'GET' && path.endsWith('/stats')) {
    const { userId } = event.queryStringParameters;
    const { startTime } = event.queryStringParameters;
    const { endTime } = event.queryStringParameters;
    const stats = await getHomeStats(userId, startTime, endTime);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: JSON.stringify(stats),
    };
  }

  if (httpMethod === 'GET' && path.endsWith('/homeowner')) {
    const { homeownerName } = event.queryStringParameters;
    return await getHomesByOwner(homeownerName);
  }

  if (httpMethod === 'POST') {
    const { itemId, updateValues, userId } = JSON.parse(event.body);

    if (itemId && updateValues && userId) {
      const key = { id: itemId };
      const updatedItem = await updateItem(key, updateValues, userId);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(updatedItem),
      };
    }
  }
  if (httpMethod === 'GET' && path.endsWith('/claimedDemands')) {
    const { marketerId, pageSize } = event.queryStringParameters;

    const claimedDemands = await fetchClaimedDemandsByMarketer(
      marketerId,
      pageSize ? parseInt(pageSize) : undefined,
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET',
      },
      body: JSON.stringify(claimedDemands),
    };
  } if (httpMethod === 'GET' && path.endsWith('/homes')) {
    const {
      locality, sublocality, status, type, mode, bedrooms, amenities, startKey,
    } = event.queryStringParameters;

    console.log('Locality:', locality, 'Sublocality:', sublocality);

    const filterExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {
      ':locality': locality,
      ':sublocality': sublocality,
    };

    // // Exclude homes with 'pending', 'approved', 'rejected' statuses
    // filterExpressions.push('NOT (#status IN (:pending, :approved, :rejected))');
    // expressionAttributeNames['#status'] = 'status';
    // expressionAttributeValues[':pending'] = 'pending';
    // expressionAttributeValues[':approved'] = 'approved';
    // expressionAttributeValues[':rejected'] = 'rejected';

    if (status) {
      filterExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }
    if (type) {
      filterExpressions.push('#type = :type');
      expressionAttributeNames['#type'] = 'type';
      expressionAttributeValues[':type'] = type;
    }
    if (mode) {
      filterExpressions.push('#mode = :mode');
      expressionAttributeNames['#mode'] = 'mode';
      expressionAttributeValues[':mode'] = mode;
    }
    if (bedrooms) {
      filterExpressions.push('#bedrooms = :bedrooms');
      expressionAttributeNames['#bedrooms'] = 'bedrooms';
      expressionAttributeValues[':bedrooms'] = bedrooms;
    }
    if (amenities) {
      filterExpressions.push('contains(#amenities, :amenities)');
      expressionAttributeNames['#amenities'] = 'amenities';
      expressionAttributeValues[':amenities'] = amenities;
    }

    let startKeyObject = null;

    // Add this code to parse the startKey from the query string parameters
    if (startKey) {
      try {
        startKeyObject = JSON.parse(decodeURIComponent(startKey));
      } catch (error) {
        console.error('Error parsing startKey:', error);
      }
    }
    const params = {
      TableName: 'UnverifiedHomes',
      IndexName: 'locality-sublocality-index',
      KeyConditionExpression: 'locality = :locality and sublocality = :sublocality',
      ExpressionAttributeValues: {
        ':locality': locality,
        ':sublocality': sublocality,
      },
      Limit: 500, // limit to 100 items
      ExclusiveStartKey: startKeyObject, // use the parsed startKey here
    };
    // Conditionally add filter expressions and their corresponding attribute names and values
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' and ');
      params.ExpressionAttributeNames = expressionAttributeNames;
      Object.assign(params.ExpressionAttributeValues, expressionAttributeValues);
    }

    try {
      const data = await dynamodb.query(params).promise();
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify({
          items: data.Items,
          lastEvaluatedKey: data.LastEvaluatedKey,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    }
  }

  // Return an error if the HTTP method was not recognized
  return {
    statusCode: 400,
    body: JSON.stringify({ error: 'Invalid HTTP method' }),
  };
};

// ...

async function fetchDemands(locality, sublocality, pageSize = 100, startKey) {
  if (locality && sublocality) {
    const params = {
      TableName: 'Demand',
      IndexName: 'Locality-Sublocality-index',
      KeyConditionExpression: '#L = :l AND #S = :s',
      ExpressionAttributeNames: {
        '#L': 'Locality',
        '#S': 'Sublocality',
      },
      ExpressionAttributeValues: {
        ':l': locality,
        ':s': sublocality,
      },
      Limit: pageSize,
    };

    if (startKey) {
      params.ExclusiveStartKey = startKey;
    }

    try {
      const result = await dynamodb.query(params).promise();

      return {
        items: result.Items,
        nextKey: result.LastEvaluatedKey,
        count: result.Count,
      };
    } catch (error) {
      console.error('Error fetching demands:', error);
      throw error;
    }
  } else {
    // Fetch all items if locality and sublocality are not provided
    const params = {
      TableName: 'Demand',
      Limit: pageSize,
    };

    if (startKey) {
      params.ExclusiveStartKey = startKey;
    }

    try {
      const result = await dynamodb.scan(params).promise();

      return {
        items: result.Items,
        nextKey: result.LastEvaluatedKey,
        count: result.Count,
      };
    } catch (error) {
      console.error('Error fetching demands:', error);
      throw error;
    }
  }
}

async function createDemand(demand) {
  demand.DemandID = uuid.v4(); // Generate a unique UUID for the DemandID
  demand.DateCreated = new Date().toISOString(); // Add the creation date
  demand.Status = 'Open'; // Initialize the status to 'Open'

  const params = {
    TableName: 'Demand',
    Item: demand,
  };

  try {
    await dynamodb.put(params).promise();
    return demand;
  } catch (error) {
    console.error('Error creating demand:', error);
    throw error;
  }
}


async function claimDemand(demandId, MarketerId) {
  console.log('claimDemand', demandId, MarketerId);
  const params = {
    TableName: 'Demand',
    Key: { DemandID: demandId }, // included MarketerID here
    ExpressionAttributeNames: {
      '#C': 'Claimed',
      '#F': 'MarketerID',
      '#S': 'Status',
      '#D': 'DateClaimed',
    },
    ExpressionAttributeValues: {
      ':c': true,
      ':f': MarketerId,
      ':s': 'Claimed',
      ':d': new Date().toISOString(),
    },
    UpdateExpression: 'SET #C = :c, #F = :f, #S = :s, #D = :d',
    ConditionExpression: 'attribute_exists(DemandID)', // Check if the item exists
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error claiming demand:', error);
    throw error;
  }
}

async function updateDemand(demandId, details, updaterId) {
  console.log('updateDemand', demandId, details, updaterId);

  const ExpressionAttributeNames = {
    '#LastUpdatedBy': 'LastUpdatedBy', // New attribute to track the updater
    '#LastUpdatedAt': 'LastUpdatedAt'  // New attribute to track when the update was made
  };
  const ExpressionAttributeValues = {
    ':lastUpdatedBy': updaterId,
    ':lastUpdatedAt': new Date().toISOString()
  };
  let UpdateExpression = 'SET #LastUpdatedBy = :lastUpdatedBy, #LastUpdatedAt = :lastUpdatedAt';

  // Loop through the details object to create the update expression
  Object.keys(details).forEach((key, index) => {
    // Create placeholder names and values for the update expression
    const attributeName = `#attr${index}`;
    const attributeValue = `:val${index}`;

    ExpressionAttributeNames[attributeName] = key;
    ExpressionAttributeValues[attributeValue] = details[key];

    // Add to the update expression
    UpdateExpression += `, ${attributeName} = ${attributeValue}`;
  });

  const params = {
    TableName: 'Demand',
    Key: { DemandID: demandId },
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression,
    ConditionExpression: 'attribute_exists(DemandID)', // Check if the item exists
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamodb.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error('Error updating demand:', error);
    throw error;
  }
}


async function fetchClaimedDemandsByMarketer(marketerId, pageSize = 100, startKey) {
  const params = {
    TableName: 'Demand',
    IndexName: 'MarketerID-Status-index', // Replace with the actual name of your GSI
    KeyConditionExpression: '#M = :m AND #S = :s',
    ExpressionAttributeNames: {
      '#M': 'MarketerID',
      '#S': 'Status',
    },
    ExpressionAttributeValues: {
      ':m': marketerId,
      ':s': 'Claimed',
    },
    Limit: pageSize,
  };

  if (startKey) {
    params.ExclusiveStartKey = startKey;
  }

  try {
    const result = await dynamodb.query(params).promise();

    return {
      items: result.Items,
      nextKey: result.LastEvaluatedKey,
      count: result.Count,
    };
  } catch (error) {
    console.error('Error fetching claimed demands:', error);
    throw error;
  }
}

async function createMarketerRequest(requestDetails) {
  requestDetails.requestID = uuid.v4();
  requestDetails.createdTime = new Date().toISOString();

  const params = {
    TableName: 'MarketerRequests',
    Item: requestDetails,
  };

  try {
    const result = await dynamodb.put(params).promise();
    console.log('Successfully created marketer request', result);
    return result;
  } catch (error) {
    console.error('Error creating marketer request:', error);
    throw error;
  }
}

async function retrieveMarketerRequests(marketerID, startDate = null, endDate = null) {
  const params = {
    TableName: 'MarketerRequests',
    IndexName: 'marketerID-createdTime-index', // Replace with the actual name of your GSI
    KeyConditionExpression: 'marketerID = :marketerId',
    ExpressionAttributeValues: {
      ':marketerId': marketerID
    }
  };

  // If startDate is provided, add a condition for createdTime
  if (startDate) {
    params.KeyConditionExpression += ' and createdTime >= :startDate';
    params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
  }

  // If endDate is provided, further narrow down the condition for createdTime
  if (endDate) {
    params.KeyConditionExpression += ' and createdTime <= :endDate';
    params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
  }

  try {
    const result = await dynamodb.query(params).promise();
    console.log('Successfully retrieved marketer requests', result.Items);
    return result.Items;
  } catch (error) {
    console.error('Error retrieving marketer requests:', error);
    throw error;
  }
}

async function createEmployeeReport(reportDetails) {
  // Add the current date and time to the report details
  reportDetails.reportID = uuid.v4();
  reportDetails.createdTime = new Date().toISOString();

  // Define the parameters for the DynamoDB put operation
  const params = {
    TableName: 'EmployeeReports',
    Item: reportDetails,
  };

  try {
    // Attempt to write the report details to the EmployeeReports table
    const result = await dynamodb.put(params).promise();
    console.log('Successfully created employee report', result);
    return result;
  } catch (error) {
    // Log any errors that occur and re-throw the error
    console.error('Error creating employee report:', error);
    throw error;
  }
}

async function retrieveEmployeeReports(employeeID, startDate = null, endDate = null) {
  const params = {
    TableName: 'EmployeeReports',
    IndexName: 'employeeID-createdTime-index', // Use the GSI for the query
    KeyConditionExpression: 'employeeID = :employeeId',
    ExpressionAttributeValues: {
      ':employeeId': employeeID
    }
  };

  // If startDate is provided, add a condition for createdTime
  if (startDate) {
    params.KeyConditionExpression += ' and createdTime >= :startDate';
    params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
  }

  // If endDate is provided, further narrow down the condition for createdTime
  if (endDate) {
    params.KeyConditionExpression += ' and createdTime <= :endDate';
    params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
  }

  try {
    const result = await dynamodb.query(params).promise();
    console.log('Successfully retrieved employee reports', result.Items);
    return result.Items;
  } catch (error) {
    console.error('Error retrieving employee reports:', error);
    throw error;
  }
}

