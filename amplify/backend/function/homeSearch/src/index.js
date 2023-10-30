/* eslint-disable no-dupe-keys */
const AWS = require('aws-sdk');
const uuid = require('uuid');
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const admin = require('firebase-admin');
const serviceAccount = require('./rentitapp-8fc19-firebase-adminsdk-ewhh3-ece25ac062.json');
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const usersRef = db.collection('users');

let miniSuperUserLocalities = {}; // This will be your cache

const dashboardWorkerIDs = [
  "7hPKvMD7BEAefbT07axJ",
  "AlSe10LMZXXvmIjq9yDW1GJoI1n2",
  "Fc43sGs32PaW7v8sooX61FtdaMY2",
  "INzOOSz9KbVbEMhOKNu7yfCdmhD2",
  "OfZNIq1Ftyc51aepnGMuidzBA1X2",
  "TOO86cvFGaZWKSUgBBlBbnpvaZJ3",
  "TWMtjQ3fSOQAx99eCM38hwbWYBm2",
  "djzNhBcDRlXu8lxtpcwFkZNJ0BU2",
  "gGrSg6noBRcDLoGRfAb7ugtxaK32",
  "kaBivAjCzeME7T4yZyolGuK9XF72",
  "r3G0H4PGxFfqniM4iozlMPOHert2",
  "t0AJw2xBBFdt2vLiBnlGb53fLRz2"
];

async function getSupervisorEndpointArnFromToken(fcmToken) {
  const fcmsnsendpointRef = db.collection('fcmsnsendpoint');

  // Query the collection for the document with the matching FCM token
  const querySnapshot = await fcmsnsendpointRef.where('fcmToken', '==', fcmToken).limit(1).get();
  
  if (querySnapshot.empty) {
    // If no document is found with the FCM token, no endpoint ARN exists
    console.log('No matching endpoint ARN found for the given FCM token.');
    return null;
  }

  // Retrieve the endpoint ARN from the document
  let endpointArn = null;
  querySnapshot.forEach(doc => {
    endpointArn = doc.data().endpointArn;
  });

  return endpointArn;
}
async function sendUpdateNotification(endpointArn, updatedAttributes) {
  // Construct the notification message
  const message = {
    GCM: JSON.stringify({
      notification: {
        title: 'Home Update Notification',
        body: `A home with ID ${updatedAttributes.homeId} has been updated. Check out the new details.`
      },
      data: {
        itemDetails: updatedAttributes
      }
    })
  };

  // Publish a push notification to the supervisor's device using FCM through Amazon SNS
  const publishParams = {
    Message: JSON.stringify(message),
    MessageStructure: 'json',
    TargetArn: endpointArn
  };

  try {
    const publishResult = await sns.publish(publishParams).promise();
    console.log(`Message sent to supervisor via FCM: ${publishResult.MessageId}`);
  } catch (err) {
    console.error('Error sending push notification through FCM', err);
  }
}

async function createSNSEndpoint(fcmToken, userId) {
  const createEndpointParams = {
    PlatformApplicationArn: 'arn:aws:sns:us-east-2:945426664553:app/GCM/RentIt', // Your SNS Platform Application ARN
    Token: fcmToken,
    CustomUserData: `UserID: ${userId}`, // Optional user data to associate the endpoint with a specific user
  };

  try {
    const endpointData = await sns.createPlatformEndpoint(createEndpointParams).promise();
    const endpointArn = endpointData.EndpointArn;
    // Store the endpointArn in your database against the supervisor's user ID
    await storeEndpointArn(userId, endpointArn);
    return endpointArn;
  } catch (err) {
    console.error('Error creating SNS endpoint for supervisor', err);
    throw err;
  }
}

async function storeEndpointArn(userId, endpointArn) {
  // Implement this function to store the endpoint ARN in Firestore
  const fcmsnsendpointRef = db.collection('fcmsnsendpoint');
  await fcmsnsendpointRef.doc(userId).set({
    endpointArn: endpointArn,
    userId: userId,
  });
}
async function ensureSNSEndpoint(userId) {
  const fcmToken = await retrieveFcmToken(userId);
  
  // Check if an endpoint ARN already exists for the FCM token
  let endpointArn = await getSupervisorEndpointArnFromToken(fcmToken);
  
  // If the endpoint ARN does not exist, create a new endpoint
  if (!endpointArn) {
    endpointArn = await createSNSEndpoint(fcmToken, userId);
  }
  
  return endpointArn;
}

async function retrieveFcmToken(userId) {
  const deviceFcmsRef = db.collection('deviceFcms');
  
  // Get the document for the specified userId
  const snapshot = await deviceFcmsRef.where('userId', '==', userId).get();

  if (snapshot.empty) {
    console.log('No matching documents for the given user ID.');
    return null;
  }
  
  let fcmToken = null;
  snapshot.forEach(doc => {
    // Assuming there's only one token per user, break after the first match
    fcmToken = doc.data().deviceToken;
  });

  return fcmToken;
}


async function fetchSupervisorLocalities() {
  const usersRef = db.collection('users');
  
  // Get users with roles 'SUPERVISOR' or 'ADMIN'
  const snapshot = await usersRef.where('role', 'in', ['SUPERVISOR', 'ADMIN']).get();

  const localities = {};
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.locality) {
      // Ensure that localities[doc.id] is always an array, whether data.locality is a string or an array
      localities[doc.id] = Array.isArray(data.locality) ? data.locality : [data.locality];
    }
  });

  return localities;
}




const dynamodb = new AWS.DynamoDB.DocumentClient();

const SUPER_USER_ID = 'UWHvpJ1XoObsFYTFR48zYe6jscJ2'; // Replace with your super user's ID



const client = new PredictionServiceClient({
  keyFilename: './rentitapp-74ea1b526b35.json',
});

const predict = async (data) => {
  const projectId = '886188852860';
  const endpointId = '4751974906038583296';
  const location = 'us-west2';
  const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

  const inputData = { instances: [data] };

  try {
      const [response] = await client.predict({
          endpoint: endpoint,
          instances: inputData.instances
      });
      
      return response;

  } catch (error) {
      console.error('Error making prediction:', error);
      throw new Error('Failed to get prediction.');
  }
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

  const miniSuperUserLocalities = await fetchSupervisorLocalities();
  console.log('miniSuperUserLocalities:', miniSuperUserLocalities);
  homeswithin = []
  homeswithout = []

  // Convert startTime and endTime to Date objects for comparison
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const statuses = ['pending', 'approved', 'rejected'];
  const stats = {};

  for (const status of statuses) {
    let params = {
        TableName: 'UnverifiedHomes',
        IndexName: 'status-updatedTime-index',  // specify the index to use
        KeyConditionExpression: '#st = :status',  // query only by status
        ExpressionAttributeNames: {
            '#st': 'status',
        },
        ExpressionAttributeValues: {
            ':status': status,
        },
    };

      try {
          const data = await dynamodb.query(params).promise();
          console.log(`Fetched ${status} homes for user ${userId}:`, data.Items);

          // Filter the items based on user type and time range
          const filteredItems = data.Items.filter(item => {
            const itemDate = new Date(item.updatedTime);
            const withinDateRange = itemDate >= startDate && itemDate <= endDate;
            if (withinDateRange){
                homeswithin.push(item.updatedTime);
            }
            else{
              homeswithout.push(item.updatedTime);
            }
        
            if (userId === SUPER_USER_ID) {
                return withinDateRange;  // Super User sees all homes within date range
            } else if (userId in miniSuperUserLocalities) {
                // Mini Super User sees all homes within their localities and date range
                const withinLocality = miniSuperUserLocalities[userId].includes(item.locality);
                console.log(`Within locality: ${withinLocality}`);  // Add logging statement
                return withinDateRange && withinLocality;
            } else {
                // Regular users see only homes they updated within date range
                const updatedByUser = item.updatedBy === userId;
                console.log(`Updated by user: ${updatedByUser}`);  // Add logging statement
                return withinDateRange && updatedByUser;
            }
        });
        console.log('Homes within',homeswithin);
        console.log('Homes without', homeswithout)
        stats[status] = { count: filteredItems.length, homes: filteredItems };
        
      } catch (error) {
          console.error(`Error fetching ${status} homes for user ${userId}:`, error);
          throw error;
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

  if (updateValues.updatedTime) {
    updateExpression += '#updatedTimeStamp = :updatedTimeStamp,';
    expressionAttributeNames['#updatedTimeStamp'] = 'updatedTimeStamp';
    expressionAttributeValues[':updatedTimeStamp'] = new Date(updateValues.updatedTime).getTime();
  }

  if (dashboardWorkerIDs.includes(userId)) {
    // This is an update by a dashboard worker
    updateExpression += '#verifiedBy = :verifiedBy, #verifiedTime = :verifiedTime';
    expressionAttributeNames['#verifiedBy'] = 'verifiedBy';
    expressionAttributeNames['#verifiedTime'] = 'verifiedTime';
    expressionAttributeValues[':verifiedBy'] = userId;
    expressionAttributeValues[':verifiedTime'] = new Date().toISOString();
  } else {
    // This is an update by a field worker
    updateExpression += '#updatedBy = :updatedBy, #updatedTime = :updatedTime';
    expressionAttributeNames['#updatedBy'] = 'updatedBy';
    expressionAttributeNames['#updatedTime'] = 'updatedTime';
    expressionAttributeValues[':updatedBy'] = userId;
    expressionAttributeValues[':updatedTime'] = new Date().toISOString();
  }

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

  if (response.Attributes) {
    try {
      // Retrieve the locality of the updated home
      const homeLocality = response.Attributes.locality;

      // Find the supervisor(s) responsible for the updated home's locality using the pre-fetched data
      let supervisorUserId = null;
      for (const [supervisorId, localities] of Object.entries(miniSuperUserLocalities)) {
        if (localities.includes(homeLocality)) {
          supervisorUserId = supervisorId;
          break;
        }
      }

      // If a supervisor is found, ensure there's an SNS endpoint and send a notification
      if (supervisorUserId) {
        const endpointArn = await ensureSNSEndpoint(supervisorUserId);
        if (endpointArn) {
          await sendUpdateNotification(endpointArn, response.Attributes);
        }
      } else {
        console.log(`No supervisor found for locality: ${homeLocality}`);
      }
    } catch (error) {
      console.error('Error during the update and notification process:', error);
    }
  }

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

  if (Object.keys(miniSuperUserLocalities).length === 0) {
    miniSuperUserLocalities = await fetchSupervisorLocalities();
  }

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

  if (httpMethod === 'POST' && path.endsWith('/prediction')) {
    const inputData = JSON.parse(event.body);
    // Define the fields that should be included in the prediction
const allowedFields = [
  "currency", "newPrice", "status", "reviews", "loyaltyProgram", 
  "latitude", "heating", "verified", "bedroom", "longitude", 
  "neighborhood", "description", "freeparking", "title", "essentials", 
  "phoneNumbers", "maxGuests", "wifi", "image", "dedicatedworkspace", 
  "kitchen", "water", "bathroom", "dryer", "pool", "availabilityDate", 
  "bed", "furnished", "available", "hottub", "mode", "washingmachine", 
  "negotiable", "marketerNumber", "toilet", "aircondition", 
  "bathroomNumber", "locality", "images", "homeownerName", "sublocality", 
  "type", "neighbourhood"
];

// Filter out fields not in the allowedFields list
for (const key in inputData) {
  if (!allowedFields.includes(key)) {
      delete inputData[key];
  }
}

    const predictionResult = await predict(inputData);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(predictionResult),
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
      const employeeID = event?.queryStringParameters?.marketerID || null;
      const startDate = event.queryStringParameters.startDate;
      const endDate = event.queryStringParameters.endDate;

      // Check if marketerID is provided, since it's mandatory
      if (!employeeID && !startDate && !endDate) {
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
      try {
        const { locality, sublocality, startDate, endDate, pageSize, startKey } = event.queryStringParameters;
    
        const demand = await fetchDemands(
          locality,
          sublocality,
          startDate,
          endDate,
          pageSize ? parseInt(pageSize) : undefined,
          startKey,
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
      } catch (error) {
        console.error('Error handling demands endpoint:', error);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({ message: "Internal Server Error" }),
        };
      }
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
      console.log('Updated item:', updatedItem);
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
    const { marketerId, status, pageSize, startKey} = event.queryStringParameters;

    const claimedDemands = await fetchClaimedDemandsByMarketer(
      marketerId,
      status,
      startKey,
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

async function fetchDemands(locality, sublocality, startDate, endDate, pageSize = 100, startKey) {
  console.log('fetchDemands called with:', { locality, sublocality, startDate, endDate, pageSize, startKey });
  
  const baseParams = {
    TableName: 'Demand',
  };

  let useScan = false; // Flag to determine if we should use scan or query

  if (locality && locality.trim() !== "" && sublocality && sublocality.trim() !== "") {
    console.log('Using Locality-Sublocality-index to query.');
    // Query by Locality and Sublocality
    Object.assign(baseParams, {
      IndexName: 'Locality-Sublocality-index',
      KeyConditionExpression: '#L = :l AND #S = :s',
      ExpressionAttributeNames: {
        '#L': 'Locality',
        '#S': 'Sublocality',
      },
      ExpressionAttributeValues: {
        ':l': locality,
        ':s': sublocality,
      }
    });
  } else if (startDate && endDate) {
    console.log('Using AllDemands-DateCreated-index to query.');
    // Query the new GSI by Date Range
    Object.assign(baseParams, {
        IndexName: 'AllDemands-DateCreated-index',
        KeyConditionExpression: '#AllDemandsPartition = :allValue AND #DateCreated BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
            '#AllDemandsPartition': 'AllDemandsPartition',
            '#DateCreated': 'DateCreated'
        },
        ExpressionAttributeValues: {
            ':allValue': 'ALL',
            ':startDate': startDate,
            ':endDate': endDate
        }
    });
  } else {
    console.log('Defaulting to scan operation.');
    useScan = true; // Set the flag
  }

  if (startKey) {
    baseParams.ExclusiveStartKey = startKey;
  }

  try {
    console.log('Executing operation with params:', baseParams);
    let result;
    if (useScan) {
      result = await dynamodb.scan(baseParams).promise();
    } else {
      result = await dynamodb.query(baseParams).promise();
    }

    console.log('Operation successful. Items fetched:', result.Items.length);

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


async function fetchClaimedDemandsByMarketer(marketerId, status, startKey, pageSize = 100) {
  const params = {
    TableName: 'Demand',
    IndexName: 'MarketerID-Status-index',
    KeyConditionExpression: '#M = :m AND #S = :s',
    ExpressionAttributeNames: {
      '#M': 'MarketerID',
      '#S': 'Status',
    },
    ExpressionAttributeValues: {
      ':m': marketerId,
      ':s': status,
    },
    Limit: pageSize,  // set the limit to pageSize
  };

  if (startKey) {
    params.ExclusiveStartKey = JSON.parse(startKey);
  }

  try {
    const result = await dynamodb.query(params).promise();

    // Remove duplicates
    const uniqueItems = [];
    const seenDemandIDs = new Set();

    for (const item of result.Items) {
      if (!seenDemandIDs.has(item.DemandID)) {
        seenDemandIDs.add(item.DemandID);
        uniqueItems.push(item);
      }
    }

    return {
      items: uniqueItems,
      nextKey: result.LastEvaluatedKey,
      count: uniqueItems.length,
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

  if (startDate && endDate) {
    // Use BETWEEN for a range query
    params.KeyConditionExpression += ' and createdTime BETWEEN :startDate AND :endDate';
    params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
    params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
  } else if (startDate) {
    params.KeyConditionExpression += ' and createdTime >= :startDate';
    params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
  } else if (endDate) {
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

async function retrieveEmployeeReports(employeeID = null, startDate = null, endDate = null) {
  let params;

  if (employeeID && employeeID !== 'UWHvpJ1XoObsFYTFR48zYe6jscJ2') {
    // Original logic for specific employeeID
    params = {
      TableName: 'EmployeeReports',
      IndexName: 'employeeID-createdTime-index',
      KeyConditionExpression: 'employeeID = :employeeId',
      ExpressionAttributeValues: {
        ':employeeId': employeeID
      }
    };

    if (startDate) {
      params.KeyConditionExpression += ' and createdTime >= :startDate';
      params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
    }

    if (endDate) {
      params.KeyConditionExpression += ' and createdTime <= :endDate';
      params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
    }
  } else {
    // This block now also handles the case where employeeID matches the special ID
    params = {
      TableName: 'EmployeeReports',
      IndexName: 'createdTime-index',  // Assuming you have a GSI on createdTime
      KeyConditionExpression: '',
      ExpressionAttributeValues: {}
    };

    if (startDate && endDate) {
      params.KeyConditionExpression = 'createdTime BETWEEN :startDate AND :endDate';
      params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
      params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
    } else if (startDate) {
      params.KeyConditionExpression = 'createdTime >= :startDate';
      params.ExpressionAttributeValues[':startDate'] = new Date(startDate).toISOString();
    } else if (endDate) {
      params.KeyConditionExpression = 'createdTime <= :endDate';
      params.ExpressionAttributeValues[':endDate'] = new Date(endDate).toISOString();
    }
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
