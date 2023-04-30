const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

// ... (haversineDistance function remains the same) ...
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2);
  Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
}

  async function personalizationEngine(userLocation, homeType, nextToken) {
    // Get all homes from DynamoDB
    const scanParams = {
      TableName: 'Post-k5j5uz5yp5d7tl2yzjyruz5db4-dev'
    };
  
    if (nextToken) {
      scanParams.ExclusiveStartKey = nextToken;
    }
  
    const allHomes = await ddb.scan(scanParams).promise();
  
    // Filter homes by the specified homeType
    const filteredHomes = allHomes.Items.filter(home => home.type === homeType);
  
    // Calculate the distance between the user location and filtered homes
    const distances = filteredHomes.map(home => {
      const distance = userLocation
        ? haversineDistance(userLocation.latitude, userLocation.longitude, home.latitude, home.longitude)
        : 0;
      return { home, distance: (distance !== 0) ? (1 / distance) : Number.MAX_VALUE }; // Inverse of distance or a very large value if distance is 0
    });
    
  
    // Define weights for distance, price, and created time
    const distanceWeight = 0.5;
    const priceWeight = 0.15;
    const timeWeight = 0.35;
  
    // Get the current timestamp
    const currentTime = new Date().getTime();
    // Calculate the similarity score for each home
    distances.forEach(item => {
      item.score = (distanceWeight * item.distance) + // Use the inverse distance directly, as it was already calculated in the previous step
                   (priceWeight * item.home.newPrice) +
                   (timeWeight * (currentTime - new Date(item.home.createdAt).getTime()));
    });
    
  
    // Sort the homes by similarity score (lower score = better match)
    distances.sort((a, b) => a.score - b.score);
  
    const personalizedHomes = distances.filter(item => item.home.status !== 'PENDING' && item.home.status !== 'REJECTED');
  
    return {
      personalizedHomes: personalizedHomes.map(item => item.home),
      newNextToken: allHomes.LastEvaluatedKey // Assuming LastEvaluatedKey is your nextToken value
    };
  }
  

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async event => {
  const requestData = JSON.parse(event.body);
  const {userLocation} = requestData;
  const {homeType} = requestData;
  const {nextToken} = requestData;

  try {
    const {personalizedHomes, newNextToken} = await personalizationEngine(
      userLocation,
      homeType,
      nextToken,
    );
    console.log('Personalized homes:', personalizedHomes); // Add console.log to check personalized homes
    console.log('New nextToken:', newNextToken); // Add console.log to check the new nextToken

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
      },
      body: JSON.stringify({homes: personalizedHomes, nextToken: newNextToken}),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({error: 'Failed to find personalized homes'}),
    };
  }
};
