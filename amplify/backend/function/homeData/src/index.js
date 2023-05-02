const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const BUCKET_NAME = 'pics175634-dev';
const GEOJSON_FILE = 'export.geojson';

const toRadians = degrees => degrees * (Math.PI / 180);

const haversineDistance = (location1, location2) => {
  const earthRadius = 6371e3; // Earth's radius in meters
  const latitude1 = toRadians(location1.latitude);
  const latitude2 = toRadians(location2.latitude);
  const longitude1 = toRadians(location1.longitude);
  const longitude2 = toRadians(location2.longitude);

  const deltaLatitude = latitude2 - latitude1;
  const deltaLongitude = longitude2 - longitude1;

  const a = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2);
  Math.cos(latitude1) *
    Math.cos(latitude2) *
    Math.sin(deltaLongitude / 2) *
    Math.sin(deltaLongitude / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const getNearbyBuildings = (
  userLocation,
  buildingLocations,
  radiusInMeters = 500,
) =>
  buildingLocations.filter(building => {
    const distance = haversineDistance(userLocation, building);
    return distance <= radiusInMeters;
  });

const getGeoJSONData = async () => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: GEOJSON_FILE,
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    console.error('Error fetching GeoJSON data:', error);
    throw error;
  }
};

exports.handler = async event => {
  const userLocation = {
    latitude: event.latitude,
    longitude: event.longitude,
  };

  try {
    const geoJSONData = await getGeoJSONData();
    const buildingLocations = geoJSONData.features
      .filter(feature => feature.properties.building)
      .map(feature => ({
        latitude: feature.geometry.coordinates[1],
        longitude: feature.geometry.coordinates[0],
      }));

    const nearbyBuildings = getNearbyBuildings(userLocation, buildingLocations);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Success',
        nearbyBuildings,
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
