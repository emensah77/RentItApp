const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

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

async function findSimilarHomes(home, N) {
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

  // Calculate the feature vector for the input home
  const featureVector1 = [        home.newPrice,        home.latitude,        home.longitude,        home.bedroom,        home.kitchen,        home.water,        home.wifi,        home.aircondition,        home.type,        home.mode,        home.bathroom    ];

  // Calculate the sum of weights for all features
  const totalWeight = Object.values(weights).reduce((acc, val) => acc + val, 0);

  // Calculate the similarity score and distance between the input home and all homes in the database
  const similarities = [];
  const maxDistance = 10000; // Set maximum acceptable distance to 30km
  for (let i = 0; i < allHomes.Items.length; i++) {
      const featureVector2 = [            allHomes.Items[i].newPrice,
          allHomes.Items[i].latitude,
          allHomes.Items[i].longitude,
          allHomes.Items[i].bedroom,
          allHomes.Items[i].kitchen,
          allHomes.Items[i].water,
          allHomes.Items[i].wifi,
          allHomes.Items[i].aircondition,
          allHomes.Items[i].type,
          allHomes.Items[i].mode,
          allHomes.Items[i].bathroom
      ];

      // Compute weighted similarity score and distance
      let weightedScore = 0;
      for (let j = 0; j < featureVector1.length; j++) {
          const weight = weights[Object.keys(weights)[j]];
          weightedScore += weight * (featureVector1[j] === featureVector2[j] ? 1 : 0);
      }
      const distance = haversineDistance(home.latitude, home.longitude, allHomes.Items[i].latitude, allHomes.Items[i].longitude);
      const score = (0.7 * (1 - (distance / maxDistance))) + (0.3 * (weightedScore / totalWeight));

      similarities.push({ home: allHomes.Items[i], score, distance });
  }

  // Sort the list of similar homes by score and distance
  similarities.sort((a, b) => {
      if (b.score !== a.score) {
          return b.score - a.score;
      } else {
          return a.distance - b.distance;
      }
  });

  // Filter out the input home
  // Filter out homes that are too far, too expensive, or have status of PENDING or REJECTED
  const filteredHomes = similarities.filter(item => item.home.id !== home.id && item.distance <= maxDistance && item.home.newPrice <= home.newPrice * 3 && item.home.status !== 'PENDING' && item.home.status !== 'REJECTED');

  // Return the top N most similar homes
  return filteredHomes.slice(0, N).map(item => item.home);
}


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 exports.handler = async (event) => {
    const home = JSON.parse(event.body);
    try {
      const similarHomes = await findSimilarHomes(home, 10);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(similarHomes)
      };
    } catch (err) {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to find similar homes' })
      };
    }
  };
