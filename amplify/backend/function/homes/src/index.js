const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const excel = require('exceljs');
const s3 = new AWS.S3();
const uuid = require('uuid');
const http = require('http');
const https = require('https');

// Increase the maximum number of simultaneous connections
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

exports.handler = async (event, context) => {
  let bucket = 'pics175634-dev';
  let key = 'LandlordApp_Savannah.xlsx';
  let workbook = new excel.Workbook();

  const params = {
    Bucket: bucket,
    Key: key,
  };

  console.log('Reading data from S3...');
  let data = await s3.getObject(params).promise();
  console.log('Data read from S3. Loading into Excel workbook...');
  await workbook.xlsx.load(data.Body);
  console.log('Excel workbook loaded.', workbook);
  let worksheet = workbook.getWorksheet('Sheet1');
  console.log('Excel worksheet loaded.', worksheet);
  let putPromises = []; // An array to store the promises returned by the Put operations

  // Atomically increment the lastProcessedRow value in the LambdaState table
  let stateParams = {
    TableName: 'LambdaState',
    Key: { id: 'lastProcessedRow' },
    UpdateExpression: 'add #v :incr',
    ExpressionAttributeNames: { '#v': 'value' },
    ExpressionAttributeValues: { ':incr': 1 },
    ReturnValues: 'UPDATED_NEW'
  };
  let updatedState = await docClient.update(stateParams).promise();
  let startRow = updatedState.Attributes.value;

  for(let row = startRow; row <= worksheet.rowCount; row++) {
    // Check if we have reached the end of the worksheet
    if (row > worksheet.rowCount) {
      console.log(`Reached the end of the worksheet at row ${row}. Stopping processing.`);
      break;
    }
    
    console.log(`Processing row ${row}...`);

    let rowData = worksheet.getRow(row).values;
    let latitude = Number(rowData[7]);
    let longitude = Number(rowData[8]);
    // Check if the latitude and longitude values are not empty
    console.log(`Row ${row} GPS coordinates: ${rowData[7]}, ${rowData[8]}`);

    if (rowData[7] === null || rowData[7] === "" || isNaN(latitude) || rowData[8] === null || rowData[8] === "" || isNaN(longitude)) {
        console.log(`Skipping row ${row} due to missing or invalid GPS coordinates.`);
        continue;
    }

    
    // Query DynamoDB to see if there's an existing item with the same latitude and longitude
    let queryParams = {
      TableName: 'UnverifiedHomes',
      IndexName: 'latitude-longitude-index', // Replace this with the name of your index
      KeyConditionExpression: 'latitude = :lat and longitude = :lon',
      ExpressionAttributeValues: {
        ':lat': latitude,
        ':lon': longitude,
      }
    };
    let queryResult = await docClient.query(queryParams).promise();

    // If there's an existing item, skip this row
    if (queryResult.Count > 0) {
      console.log(`Skipping row ${row} due to existing item with same GPS coordinates.`);
      continue;
    }

    
    let item = {
      id: uuid.v4(),
      createdTime: new Date().toISOString(),
      updatedTime: new Date().toISOString(),
      userID: 'defaultUser',
      reviews: [], // default reviews
      image: '',
      images: [],
      type: 'defaultType',
      title: 'defaultTitle',
      description: `${rowData[4]} ${rowData[5]} ${rowData[6]} `, // concatenating fields to form a coherent description
      mode: '',
      phoneNumbers: [rowData[10]], // assuming Contact# of Hshld is the phoneNumber
      marketerNumber: [], // default marketer number
      currency: [], // default currency
      status: 'defaultStatus',
      availabilityDate: 'defaultAvailabilityDate',
      homeownerName: rowData[3], // assuming Name of hse/owner/Landlord is the homeownerName
      negotiable: '',
      furnished: '',
      loyaltyProgram: '',
      verified: '',
      available: '',
      bed: 0, // default number of beds
      bedroom: 0, // default number of bedrooms
      bathroomNumber: 0, // default number of bathrooms
      maxGuests: 0, // default max guests
      wifi: '',
      kitchen: '',
      bathroom: '',
      water: '',
      toilet: '',
      aircondition: '',
      locality: rowData[1], // Changed from rowData[8]
      sublocality: rowData[2], // Changed from rowData[6]
      videoUrl: '',
      oldPrice: 0.0,
      newPrice: 0.0, // default new price
      latitude: Number(rowData[7]), // Changed from parseFloat(rowData[9])
      longitude: Number(rowData[8]),
      neighborhood: rowData[4],
    };

    let params = {
      TableName: 'UnverifiedHomes', // change this to your DynamoDB table name
      Item: item
    };
    console.log('Starting Put operation...');
    let putPromise = docClient.put(params).promise();
    putPromises.push(putPromise); // Add the promise to the array
    stateParams = {
      TableName: 'LambdaState',
      Key: { id: 'lastProcessedRow' },
      UpdateExpression: 'set #v = :v',
      ExpressionAttributeNames: { '#v': 'value' },
      ExpressionAttributeValues: { ':v': row }
    };
    await docClient.update(stateParams).promise();
  }

  // Wait for all the Put operations to complete
  try {
    await Promise.all(putPromises);
    console.log('All items inserted into DynamoDB.');
  } catch(error) {
    console.log('Error inserting items into DynamoDB', error);
  }
};