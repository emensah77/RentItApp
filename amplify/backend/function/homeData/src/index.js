const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const toRadians = degrees => degrees * (Math.PI / 180);

const haversineDistance = (location1, location2) => {
  const earthRadius = 6371e3; // Earth's radius in meters
  const latitude1 = toRadians(location1.latitude);
  const latitude2 = toRadians(location2.latitude);
  const longitude1 = toRadians(location1.longitude);
  const longitude2 = toRadians(location2.longitude);

  console.log(`latitude1: ${latitude1}, latitude2: ${latitude2}, longitude1: ${longitude1}, longitude2: ${longitude2}`); // Log the converted values

  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = longitude2 - longitude1;

  console.log(`deltaLatitude: ${deltaLatitude}, deltaLongitude: ${deltaLongitude}`); // Log the deltas

  const a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(latitude1) *
    Math.cos(latitude2) *
    Math.sin(deltaLongitude / 2) *
    Math.sin(deltaLongitude / 2);

  console.log(`a: ${a}`); // Log 'a'

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  console.log(`c: ${c}`); // Log 'c'

  return earthRadius * c;
};

const getUnverifiedHomes = async () => {
  const params = {
    TableName: 'UnverifiedHomes',
  };

  try {
    const data = await ddb.scan(params).promise();
    console.log('UnverifiedHomes:', data.Items.length);
    return data.Items;
  } catch (error) {
    console.error('Error fetching UnverifiedHomes:', error);
    throw error;
  }
};

exports.handler = async event => {
  
  const userLocation = JSON.parse(event.body);


  console.log(`User's Location: ${JSON.stringify(userLocation)}`); // Log user's location
  console.log(`User's latitude type: ${typeof event.latitude}`); // Log type of user's latitude
  console.log(`User's longitude type: ${typeof event.longitude}`); // Log type of user's longitude

  try {
    const homesData = await getUnverifiedHomes();
    const homeLocations = homesData.map(home => {
      console.log(`Home latitude type: ${typeof home.latitude}`); // Log type of home's latitude
      console.log(`Home longitude type: ${typeof home.longitude}`); // Log type of home's longitude
      return {
        latitude: home.latitude,
        longitude: home.longitude,
      };
    });

    const nearbyHomes = homeLocations.filter(home => {
      const distance = haversineDistance(userLocation, home);
      console.log(`Distance to home ${JSON.stringify(home)}: ${distance}`); // Log distance to each home
      return distance <= 10000; // Homes within 500 meters
    });

    console.log(`Nearby homes: ${JSON.stringify(nearbyHomes)}`); // Log nearby homes

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        nearbyHomes,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing request',
        error: error.message,
      }),
    };
  }
};
