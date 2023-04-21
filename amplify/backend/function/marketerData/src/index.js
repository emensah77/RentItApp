const AWS = require('aws-sdk');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./rentitapp-8fc19-firebase-adminsdk-ewhh3-ece25ac062.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const storeLocationData = async (locationData) => {
  const db = admin.firestore();

  // Get the user document from the "users" collection
  const userDocRef = db.collection('users').doc(locationData.userID);
  const userDoc = await userDocRef.get();

  // Check if the user document exists and retrieve the phoneNumber, otherwise use the default value "not available"
  const phoneNumber = userDoc.exists ? userDoc.data().phoneNumber : "not available";

  // Store location data in the "marketerData" collection, using the user's uid as the document ID
  const docRef = db.collection('marketerData').doc(locationData.userID);

  const doc = await docRef.get();

  if (doc.exists) {
    // If the document exists, update the location data array with the new location
    await docRef.update({
      isOnline: locationData.isOnline,
      phoneNumber: phoneNumber,
      locations: admin.firestore.FieldValue.arrayUnion({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp,
      }),
    });
  } else {
    // If the document doesn't exist, create a new document with the initial location data array
    await docRef.set({
      userID: locationData.userID,
      userName: locationData.userName,
      phoneNumber: phoneNumber,
      isOnline: locationData.isOnline,
      locations: [
        {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timestamp: locationData.timestamp,
        },
      ],
    });
  }
  
    console.log('Location data stored:', locationData);
  };
  


const getLocationDataByDateRange = async (userID, startDate, endDate) => {
  const db = admin.firestore();

  // Get the document for the specified user
  const docRef = db.collection('marketerData').doc(userID);
  const doc = await docRef.get();

  if (doc.exists) {
    const locationData = doc.data().locations;

    // Filter location data by the given date range
    const filteredLocationData = locationData.filter((location) => {
      const locationDate = new Date(location.timestamp);
      return locationDate >= startDate && locationDate <= endDate;
    });

    return filteredLocationData;
  } else {
    throw new Error('User not found');
  }
};

exports.handler = async (event) => {
  try {
    console.log('Lambda function started');
    console.log("Lambda function started");
    console.log("Received event:", event);



    // Parse incoming data from the event body
    const requestData = JSON.parse(event.body);

    if (requestData.action === 'storeLocationData') {
      const locationData = {
        userID: requestData.userID,
        userName: requestData.userName,
        latitude: requestData.latitude,
        longitude: requestData.longitude,
        timestamp: requestData.timestamp,
        isOnline: requestData.isOnline,
            
      };

      await storeLocationData(locationData);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Location data stored successfully' }),
      };
    } else if (requestData.action === 'getLocationDataByDateRange') {
      const userID = requestData.userID;
      const startDate = new Date(requestData.startDate);
      const endDate = new Date(requestData.endDate);

      const locationData = await getLocationDataByDateRange(userID, startDate, endDate);

      return {
        statusCode: 200,
        body: JSON.stringify({ locationData }),
      };
    } else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred' }),
    };
  }
};
