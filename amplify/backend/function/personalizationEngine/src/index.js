const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

// ... (haversineDistance function remains the same) ...
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    const d = R * c; // in metres
    return d;
  }

async function personalizationEngine(userLocation, homeType) {
  // Get all homes from DynamoDB
  
  const allHomes = await ddb.scan({ TableName: 'Post-k5j5uz5yp5d7tl2yzjyruz5db4-dev' }).promise();

  // Define weights for each feature (higher weight = more important)
  const weights = {
    newPrice: 4,
    latitude: 5,
    longitude: 5,
    bedroom: 1,
    kitchen: 1,
    water: 1,
    wifi: 1,
    aircondition: 1,
    type: 3,
    mode: 3,
    bathroom: 1
  };

  // Calculate the sum of weights for all features
  const totalWeight = Object.values(weights).reduce((acc, val) => acc + val, 0);

  // Filter homes by the specified homeType
  const filteredHomes = allHomes.Items.filter(home => home.type === homeType);

  // Calculate the similarity score and distance between the user location and filtered homes
  const similarities = [];
  const maxDistance = 10000; // Set maximum acceptable distance to 10km
  for (let i = 0; i < filteredHomes.length; i++) {
    const featureVector1 = [
      userLocation.latitude,
      userLocation.longitude
    ];
    const featureVector2 = [
      filteredHomes[i].latitude,
      filteredHomes[i].longitude
    ];

    // Compute weighted similarity score and distance
    let weightedScore = 0;
    for (let j = 0; j < featureVector1.length; j++) {
      const weight = weights[Object.keys(weights)[j]];
      weightedScore += weight * (featureVector1[j] === featureVector2[j] ? 1 : 0);
    }
    const distance = haversineDistance(userLocation.latitude, userLocation.longitude, filteredHomes[i].latitude, filteredHomes[i].longitude);
    const score = (0.7 * (1 - (distance / maxDistance))) + (0.3 * (weightedScore / totalWeight));

    similarities.push({ home: filteredHomes[i], score, distance });
  }

  // Sort the list of similar homes by score and distance
  similarities.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    } else {
      return a.distance - b.distance;
    }
  });
  const personalizedHomes = similarities.filter(item => item.home.status !== 'PENDING' && item.home.status !== 'REJECTED');

  return personalizedHomes.map(item => item.home);
}

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    console.log("Received event.body:", event.body); // Add this line to log the received event.body

  const requestData = JSON.parse(event.body);
  const userLocation = requestData.userLocation;
  const homeType = requestData.homeType;

  try {
    const personalizedHomes = await personalizationEngine(userLocation, homeType);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify(personalizedHomes)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
     
      body: JSON.stringify({ error: 'Failed to find personalized homes' })
    };
}
};    