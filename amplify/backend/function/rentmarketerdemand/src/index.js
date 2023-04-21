const AWS = require('aws-sdk');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your service account credentials
const serviceAccount = require('./rentitapp-8fc19-firebase-adminsdk-ewhh3-ece25ac062.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fetch data from Firestore and process it to identify high-demand places
const fetchHighDemandPlaces = async () => {
  const db = admin.firestore();

  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 365);
  console.log('30 days ago:', thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 365));

  // Fetch rental inquiries from the last 30 days
  const rentalInquiriesSnapshot = await db
    .collection('searchQuery')
    .where('created_at', '>', thirtyDaysAgo)
    .get();

  const rentalInquiries = [];
  rentalInquiriesSnapshot.forEach((doc) => {
    rentalInquiries.push(doc.data());
  });

  const demandByPlace = rentalInquiries.reduce((accumulator, currentValue) => {
    const place = currentValue.place;
    if (!accumulator[place]) {
      accumulator[place] = {
        count: 0,
        lat: currentValue.latitude,
        lng: currentValue.longitude,
      };
    }
    accumulator[place].count += 1;
    return accumulator;
  }, {});

  const highDemandPlaces = Object.entries(demandByPlace)
    .map(([place, data]) => ({
      place,
      count: data.count,
      lat: data.lat,
      lng: data.lng,
    }))
    .sort((a, b) => b.count - a.count);

  return highDemandPlaces;
};

const formatHeatmapData = (data) => {
    return data.map((item) => {
      if (!item.lat || !item.lng) {
        console.error('Undefined latitude or longitude:', item);
        return;
      }
  
      const avgLatitude = (item.lat[0] + item.lat[1]) / 2;
      const avgLongitude = (item.lng[0] + item.lng[1]) / 2;
  
      return {
        latitude: avgLatitude,
        longitude: avgLongitude,
        weight: item.count,
        place: item.place, // Add the place

      };
    }).filter(Boolean);
  };
  
  
  

exports.handler = async (event) => {
  try {
    console.log('Lambda function started');
    const highDemandPlaces = await fetchHighDemandPlaces();
    const heatmapData = formatHeatmapData(highDemandPlaces);
    console.log('Heatmap data:', heatmapData);

    return {
      statusCode: 200,
      body: JSON.stringify({ heatmapData }),
    };
  } catch (error) {
    console.error('Error in Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred' }),
    };
  }
};
