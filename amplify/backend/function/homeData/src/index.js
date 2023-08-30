const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const toRadians = (degrees) => degrees * (Math.PI / 180);

const haversineDistance = (location1, location2) => {
  const earthRadius = 6371e3; // Earth's radius in meters
  const latitude1 = toRadians(location1.latitude);
  const latitude2 = toRadians(location2.latitude);
  const longitude1 = toRadians(location1.longitude);
  const longitude2 = toRadians(location2.longitude);

  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = longitude2 - longitude1;

  const a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2)
    + Math.cos(latitude1)
      * Math.cos(latitude2)
      * Math.sin(deltaLongitude / 2)
      * Math.sin(deltaLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const getUnverifiedHomes = async () => {
  const params = {
    TableName: 'UnverifiedHomes',
  };

  try {
    const data = await ddb.scan(params).promise();
    return data.Items;
  } catch (error) {
    console.error('Error fetching UnverifiedHomes:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  const userLocation = JSON.parse(event.body);

  try {
    const homesData = await getUnverifiedHomes();
    const homeLocations = homesData.map((home) => ({
      latitude: home.latitude,
      longitude: home.longitude,
    }));

    const nearbyHomes = homeLocations.filter((home) => {
      const distance = haversineDistance(userLocation, home);
      return distance <= 10000; // Homes within 500 meters
    });

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
