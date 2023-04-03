const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const currentDate = new Date().toISOString();

exports.handler = async (event) => {
  const { postId, viewingDate, viewingTime, userName, userContact, userLocation, userId } = JSON.parse(event.body);
  const viewingDateTime = `${viewingDate}_${viewingTime}`;

  const bufferInMinutes = 30;
  const viewingTimeMoment = new Date(viewingDate + 'T' + viewingTime);
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
    console.log('Query result:', result); // Log the result of the query

    if (result.Items.length > 0) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'The selected date and time for this property are already scheduled.' }),
      };
    }

    const reps = ['Lydia', 'Priscilla', 'Juliana'];
    const assignedRep = reps[Math.floor(Math.random() * reps.length)];

    const newItemParams = {
      TableName: 'Viewing-k5j5uz5yp5d7tl2yzjyruz5db4-dev',
      Item: {
        id: uuidv4(), // Add the id attribute with a unique value
        postId: postId,
        username: userName,
        usercontact: userContact,
        userlocation: userLocation,
        viewingDate: viewingDate,
        viewingTime: viewingTime,
        createdAt: currentDate,
        updatedAt: currentDate,
        viewingDateTime: viewingDateTime,
        userId: userId,
        status: 'Todo', // Add the status attribute with the default value 'Todo'
        assignedRep: assignedRep, // Assign the viewing to a randomly selected rep
      },
    };

    await dynamoDb.put(newItemParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Viewing scheduled successfully.' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred while scheduling the viewing.' }),
    };
  }
};
