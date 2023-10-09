const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const currentDate = new Date().toISOString();
const sns = new AWS.SNS();

async function sendSMSNotification(phoneNumber, message) {
  const params = {
    PhoneNumber: phoneNumber,
    Message: message,
  };

  try {
    await sns.publish(params).promise();
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

async function findRepForUser(userId) {
  const params = {
    TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
    IndexName: 'userId-index',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    if (result.Items.length > 0) {
      return result.Items[0].assignedRep;
    }
  } catch (error) {
    console.error('Error finding rep for user:', error);
  }

  return null;
}

exports.handler = async (event) => {
  console.log('Event received', event);
  const body = JSON.parse(event.body);
  const action = body.action || 'createViewing';  // Default to createViewing if no action is provided
  
  switch (action) {
    case 'createViewing':
      return await createViewing(body);
    case 'retrieveViewings':
      return await retrieveViewings(body);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid action' }),
      };
  }
};

async function createViewing(body) {
  const {
    postId, viewingDate, viewingTime, userName, userContact, userLocation, userId,
  } = body;
  const viewingDateTime = `${viewingDate}_${viewingTime}`;

  const bufferInMinutes = 30;
  const viewingTimeMoment = new Date(`${viewingDate}T${viewingTime}`);
  const startTime = new Date(viewingTimeMoment.getTime() - bufferInMinutes * 60 * 1000);
  const endTime = new Date(viewingTimeMoment.getTime() + bufferInMinutes * 60 * 1000);
  const startTimeString = `${viewingDate}_${startTime.toISOString().substr(11, 8)}`;
  const endTimeString = `${viewingDate}_${endTime.toISOString().substr(11, 8)}`;

  const params = {
    TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
    IndexName: 'postId-viewingDateTime-index',
    KeyConditionExpression: 'postId = :postId AND viewingDateTime BETWEEN :startTime AND :endTime',
    ExpressionAttributeValues: {
      ':postId': postId,
      ':startTime': startTimeString,
      ':endTime': endTimeString,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();

    if (result.Items.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: 'The selected date and time for this property are already scheduled.',
        }),
      };
    }

    const reps = [
      'Lydia',
      'Priscilla',
      'Juliana',
      'Jacqueline',
      'Josephine',
      'Violet',
      'Memuna',
      'Princess',
      'Dzigbordi',
      'Rosabell',
    ];

    // Check if the user has a rep assigned from a previous viewing
    const previousRep = await findRepForUser(userId);

    // If the user has a previous rep assigned, use the same rep. Otherwise, assign a random rep.
    const assignedRep = previousRep || reps[Math.floor(Math.random() * reps.length)];

    const newItemParams = {
      TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
      Item: {
        id: uuidv4(), // Add the id attribute with a unique value
        postId,
        username: userName,
        usercontact: userContact,
        userlocation: userLocation,
        viewingDate,
        viewingTime,
        createdAt: currentDate,
        updatedAt: currentDate,
        viewingDateTime,
        userId,
        status: 'Todo', // Add the status attribute with the default value 'Todo'
        assignedRep, // Assign the viewing to a randomly selected rep
      },
    };

    await dynamoDb.put(newItemParams).promise();
    const message = `Hi ${userName}, your viewing for property ID ${postId} has been scheduled for ${viewingDate} at ${viewingTime}.`;
    await sendSMSNotification(userContact, message);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Viewing scheduled successfully.' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while scheduling the viewing.',
      }),
    };
  }
}

async function retrieveViewings(body) {
  const { userId } = body;  // Extract userId from the parsed data

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'userId is required' }),
    };
  }

  const params = {
    TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
    IndexName: 'userId-index',  // Assuming there's a GSI on userId
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
  };

  try {
    const result = await dynamoDb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ viewings: result.Items }),
    };
  } catch (error) {
    console.error('Error retrieving viewings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred while retrieving viewings' }),
    };
  }
}
