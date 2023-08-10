/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const AWS = require('aws-sdk');
const https = require('https');
const url = require('url');
const path = require('path');

AWS.config.update({
  region: 'us-east-2',
});

const ddb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Post-k5j5uz5yp5d7tl2yzjyruz5db4-dev';
const lambdaStateTableName = 'LambdaState';
const stateId = 'LAST_EVALUATED_KEY';

const opensearchDomain =
  'https://search-rentit-kigszj3wbqqurgdplgmtk3bkqa.us-east-2.es.amazonaws.com';
const index = 'rentit';
const endpoint = new AWS.Endpoint(opensearchDomain);

exports.handler = async event => {
  console.log('Starting execution of Lambda function');
  console.log('Received a request', event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Headers':
          'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
      body: JSON.stringify({message: 'CORS headers sent successfully'}),
    };
  }

  if (event.httpMethod === 'POST' && event.path === '/search') {
    let searchParameters;
    try {
      // Parse the request body to get the search parameters
      searchParameters = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing search parameters: ', error);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Bad Request. Invalid search parameters.',
      };
    }
    try {
      const results = await search(searchParameters);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Error during search: ', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Internal Server Error. Failed to perform search.',
      };
    }
  } else if (event.httpMethod === 'GET' && event.path === '/home') {
    let homeId;
    try {
      // Parse the home id from the queryStringParameters
      homeId = event.queryStringParameters.homeId;
    } catch (error) {
      console.error('Error parsing home id: ', error);
      return {
        statusCode: 400,
        body: 'Bad Request. Invalid home id.',
      };
    }
    try {
      const home = await getHome(homeId);
      return {
        statusCode: 200,
        body: JSON.stringify(home),
      };
    } catch (error) {
      console.error('Error during retrieving home: ', error);
      return {
        statusCode: 500,
        body: 'Internal Server Error. Failed to retrieve home.',
      };
    }
  } else if (event.httpMethod === 'POST' && event.path === '/unverifiedhomes') {
    let userLocation, searchAfter;
    try {
      // Parse the request body to get the userLocation and optionally searchAfter
      const requestBody = JSON.parse(event.body);
      userLocation = requestBody.userLocation;
      searchAfter = requestBody.searchAfter || null;
    } catch (error) {
      console.error('Error parsing user location or searchAfter: ', error);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Bad Request. Invalid user location or searchAfter.',
      };
    }
    try {
      const results = await fetchUnverifiedHomes(userLocation, searchAfter);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Error during fetching unverified homes: ', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Internal Server Error. Failed to fetch unverified homes.',
      };
    }
  } else if (event.httpMethod === 'POST' && event.path === '/forsale') {
    let userLocation, searchAfter;
    try {
      // Parse the request body to get the userLocation and optionally searchAfter
      const requestBody = JSON.parse(event.body);
      userLocation = requestBody.userLocation;
      searchAfter = requestBody.searchAfter || null;
    } catch (error) {
      console.error('Error parsing user location or searchAfter: ', error);
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Bad Request. Invalid user location or searchAfter.',
      };
    }
    try {
      const results = await forSale(userLocation, searchAfter);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Error during fetching unverified homes: ', error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: 'Internal Server Error. Failed to fetch homes for sale.',
      };
    }
  } else if (event.httpMethod === 'POST' && event.path === '/create') {
    let requestBody;
    try {
      // Parse the request body to get the index and table names
      requestBody = JSON.parse(event.body);
    } catch (error) {
      console.error('Error parsing request body: ', error);
      return {
        statusCode: 400,
        body: 'Bad Request. Invalid request body.',
      };
    }

    const {indexName, dbtableName} = requestBody;

    if (!indexName || !dbtableName) {
      return {
        statusCode: 400,
        body: 'Bad Request. The request body must contain indexName and tableName.',
      };
    }
    console.log('Creating index in OpenSearch');
    await createIndexInOpenSearch(indexName);
    console.log('Finished creating index in OpenSearch');

    // Retrieve the last evaluated key from DynamoDB
    let lastEvaluatedKey = await getLastEvaluatedKey();

    const params = {
      TableName: dbtableName,
      ExclusiveStartKey: lastEvaluatedKey,
    };

    try {
      console.log('Starting DynamoDB scan');
      const data = await ddb.scan(params).promise();
      console.log('Finished DynamoDB scan');

      for (const item of data.Items) {
        console.log(`Posting document to OpenSearch: ${JSON.stringify(item)}`);
        await postDocumentToOpenSearch(item, indexName);
        console.log(`Finished posting document to OpenSearch: ${JSON.stringify(item)}`);
      }

      // Save the last evaluated key
      lastEvaluatedKey = data.LastEvaluatedKey;
      await saveLastEvaluatedKey(lastEvaluatedKey);

      console.log('Finished execution of Lambda function');
      return {
        statusCode: 200,
        body: 'Done',
      };
    } catch (error) {
      console.error(`Error during execution of Lambda function: ${error}`);
      return {
        statusCode: 500,
        body: 'Error',
      };
    }
  } else if (event.httpMethod === 'POST' && event.path === '/filter') {
    let filterParams, userLocation, searchAfter;
    try {
      // Parse the request body to get the filter parameters
      const requestBody = JSON.parse(event.body);
      filterParams = requestBody.filterParams;
      userLocation = requestBody.userLocation || null;
      searchAfter = requestBody.searchAfter || null;
    } catch (error) {
      console.error('Error parsing filter parameters: ', error);
      return {
        statusCode: 400,
        body: 'Bad Request. Invalid filter parameters.',
      };
    }
    try {
      const results = await filterHomes(filterParams, userLocation, searchAfter);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Error during search: ', error);
      return {
        statusCode: 500,
        body: 'Internal Server Error. Failed to perform search.',
      };
    }
  } else if (event.httpMethod === 'POST' && event.path === '/hometype') {
    let typeParameter, userLocation, searchAfter;
    try {
      // Parse the request body to get the typeParameter and userLocation
      const requestBody = JSON.parse(event.body);
      typeParameter = requestBody.typeParameter;
      userLocation = requestBody.userLocation || null;
      searchAfter = requestBody.searchAfter || null;
    } catch (error) {
      console.error('Error parsing type parameter or user location: ', error);
      return {
        statusCode: 400,
        body: 'Bad Request. Invalid type parameter or user location.',
      };
    }
    try {
      const results = await homeType(typeParameter, userLocation, searchAfter);
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Headers':
            'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
        body: JSON.stringify(results),
      };
    } catch (error) {
      console.error('Error during home type search: ', error);
      return {
        statusCode: 500,
        body: 'Internal Server Error. Failed to perform home type search.',
      };
    }
  } else {
    console.log('No valid operation requested. Ending the execution of the Lambda function');
    return {
      statusCode: 400,
      body: 'Bad Request. This function only supports /search and /create operations.',
    };
  }
};

async function getLastEvaluatedKey() {
  const params = {
    TableName: lambdaStateTableName,
    Key: {id: stateId},
  };
  const data = await ddb.get(params).promise();
  return data.Item ? data.Item.lastEvaluatedKey : null;
}

async function saveLastEvaluatedKey(lastEvaluatedKey) {
  const params = {
    TableName: lambdaStateTableName,
    Item: {id: stateId, lastEvaluatedKey},
  };
  await ddb.put(params).promise();
}

async function createIndexInOpenSearch(indexName) {
  console.log(`Starting createIndexInOpenSearch for index: ${indexName}`);

  const req = new AWS.HttpRequest(endpoint);

  req.method = 'HEAD'; // Use HEAD to check if index exists
  req.path = path.join('/', indexName);
  req.region = 'us-east-2';
  req.headers['presigned-expires'] = false;
  req.headers.Host = endpoint.host;

  const signer = new AWS.Signers.V4(req, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const exists = await new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      req,
      null,
      function (httpResp) {
        resolve(httpResp.statusCode === 200);
      },
      function (err) {
        console.log('Error while checking index existence:', err);
        reject(err);
      },
    );
  });

  // If index does not exist, create it
  if (!exists) {
    const putReq = new AWS.HttpRequest(endpoint);

    putReq.method = 'PUT'; // Use PUT to create an index
    putReq.path = path.join('/', indexName);
    putReq.region = 'us-east-2';
    putReq.headers['presigned-expires'] = false;
    putReq.headers.Host = endpoint.host;
    putReq.headers['Content-Type'] = 'application/json';

    // Define the index mapping
    putReq.body = JSON.stringify({
      mappings: {
        properties: {
          location: {
            type: 'geo_point',
          },
        },
      },
    });

    const putSigner = new AWS.Signers.V4(putReq, 'es'); // You must sign this request separately
    putSigner.addAuthorization(AWS.config.credentials, new Date());

    const createPromise = new Promise((resolve, reject) => {
      const send = new AWS.NodeHttpClient();
      send.handleRequest(
        putReq,
        null,
        function (httpResp) {
          let body = '';
          httpResp.on('data', chunk => {
            body += chunk;
          });
          httpResp.on('end', () => {
            console.log(`Response body: ${body}`);
            console.log(`Finished createIndexInOpenSearch for index: ${indexName}`);
            resolve(body);
          });
        },
        function (err) {
          console.log('Error while creating index:', err);
          reject(err);
        },
      );
    });

    await createPromise;
  }

  console.log(`Finished createIndexInOpenSearch for index: ${indexName}`);
}

async function postDocumentToOpenSearch(doc, indexName) {
  console.log(`Starting postDocumentToOpenSearch for document: ${JSON.stringify(doc)}`);

  const postReq = new AWS.HttpRequest(endpoint);

  postReq.method = 'POST';
  postReq.path = path.join('/', indexName, '_doc', doc.id); // Use the document ID in the path
  postReq.region = 'us-east-2';
  postReq.headers['presigned-expires'] = false;
  postReq.headers.Host = endpoint.host;
  postReq.headers['Content-Type'] = 'application/json';
  postReq.body = JSON.stringify({
    ...doc,
    location: {lat: doc.latitude, lon: doc.longitude},
  });

  const postSigner = new AWS.Signers.V4(postReq, 'es');
  postSigner.addAuthorization(AWS.config.credentials, new Date());

  const postPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      postReq,
      null,
      function (httpResp) {
        let body = '';
        httpResp.on('data', chunk => {
          body += chunk;
        });
        httpResp.on('end', chunk => {
          console.log(`Response body: ${body}`);
          console.log(`Finished postdocument for doc: ${doc}`);
          resolve(body);
        });
      },
      reject,
    );
  });

  console.log(`Finished postDocumentToOpenSearch for document: ${JSON.stringify(doc)}`);
  return postPromise;
}

async function search(params) {
  console.log(`Starting search in OpenSearch index: ${index}`);

  const {region, userLocation = null, searchQuery = null, searchAfter = null} = params;

  console.log('Search Parameters:', params);

  const searchReq = new AWS.HttpRequest(endpoint);

  searchReq.method = 'POST';
  searchReq.path = path.join('/', index, '_search');
  searchReq.region = 'us-east-2';
  searchReq.headers['presigned-expires'] = false;
  searchReq.headers.Host = endpoint.host;
  searchReq.headers['Content-Type'] = 'application/json';

  const searchQueryBody = {
    size: 30,
    _source: [
      'currency',
      'newPrice',
      'status',
      'phoneNumbers',
      'maxGuests',
      'loyaltyProgram',
      'videoUrl',
      'wifi',
      'image',
      'kitchen',
      'water',
      'bathroom',
      'id',
      'latitude',
      'bed',
      'furnished',
      'mode',
      'negotiable',
      'createdAt',
      'oldPrice',
      'marketerNumber',
      'toilet',
      'aircondition',
      'bathroomNumber',
      'bedroom',
      'locality',
      'updatedAt',
      'userID',
      'longitude',
      'images',
      'description',
      'sublocality',
      'title',
      'type',
      'location',
    ],
    query: {},
    sort: [],
  };

  if (userLocation) {
    searchQueryBody.sort.push({
      _geo_distance: {
        location: {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        },
        order: 'asc',
        unit: 'km',
      },
    });
  } else {
    searchQueryBody.sort.push({
      createdAt: {
        order: 'desc',
      },
    });
  }

  if (
    region &&
    region.northeast &&
    region.northeast.lat !== null &&
    region.northeast.lon !== null &&
    region.southwest &&
    region.southwest.lat !== null &&
    region.southwest.lon !== null
  ) {
    searchQueryBody.query.bool = {
      filter: {
        geo_bounding_box: {
          location: {
            top_left: {
              lat: region.northeast.lat,
              lon: region.northeast.lon,
            },
            bottom_right: {
              lat: region.southwest.lat,
              lon: region.southwest.lon,
            },
          },
        },
      },
    };
  } else if (searchQuery) {
    searchQueryBody.query.bool = {
      should: [
        {match_phrase: {title: searchQuery}},
        {match_phrase: {description: searchQuery}},
        {match: {title: {query: searchQuery, operator: 'and'}}},
        {match: {description: {query: searchQuery, operator: 'and'}}},
      ],
    };
  }

  if (searchAfter) {
    searchQueryBody.search_after = searchAfter;
  }

  searchReq.body = JSON.stringify(searchQueryBody);

  const signer = new AWS.Signers.V4(searchReq, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const searchPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      searchReq,
      null,
      httpResp => {
        let responseBody = '';
        httpResp.on('data', chunk => {
          responseBody += chunk;
        });
        httpResp.on('end', chunk => {
          const data = JSON.parse(responseBody);

          console.log(`Search results: ${JSON.stringify(data.hits.hits)}`);

          const homesData = data.hits.hits.map(hit => hit._source);
          const result = {
            homes: homesData,
            searchAfter:
              data.hits.hits.length > 0 ? data.hits.hits[data.hits.hits.length - 1].sort : null,
            count: data.hits.total.value,
          };

          resolve(result);
        });
      },
      reject,
    );
  });

  console.log(`Finished search in OpenSearch index: ${index}`);
  return searchPromise;
}

async function getHome(id) {
  console.log(`Starting getHome for home id: ${id}`);

  const getReq = new AWS.HttpRequest(endpoint);

  getReq.method = 'GET';
  getReq.path = path.join('/', index, '_doc', id); // Use the document ID in the path
  getReq.region = 'us-east-2';
  getReq.headers['presigned-expires'] = false;
  getReq.headers.Host = endpoint.host;

  const getSigner = new AWS.Signers.V4(getReq, 'es');
  getSigner.addAuthorization(AWS.config.credentials, new Date());

  const getPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      getReq,
      null,
      function (httpResp) {
        let body = '';
        httpResp.on('data', chunk => {
          body += chunk;
        });
        httpResp.on('end', chunk => {
          console.log(`Response body: ${body}`);
          console.log(`Finished getHome for home id: ${id}`);
          resolve(JSON.parse(body)._source);
        });
      },
      function (err) {
        console.log('Error while retrieving home:', err);
        reject(err);
      },
    );
  });

  console.log(`Finished getHome for home id: ${id}`);
  return getPromise;
}

async function homeType(typeParameter, userLocation = null, searchAfter = null) {
  console.log(`Starting search in OpenSearch index: ${index}`);

  const searchTypeReq = new AWS.HttpRequest(endpoint);

  searchTypeReq.method = 'POST';
  searchTypeReq.path = path.join('/', index, '_search');
  searchTypeReq.region = 'us-east-2';
  searchTypeReq.headers['presigned-expires'] = false;
  searchTypeReq.headers.Host = endpoint.host;
  searchTypeReq.headers['Content-Type'] = 'application/json';

  const searchQueryBody = {
    size: 30,
    query: {
      bool: {
        filter: [
          {
            term: {
              'type.keyword': typeParameter,
            },
          },
        ],
      },
    },
    sort: [],
  };

  if (userLocation) {
    searchQueryBody.sort.push({
      _geo_distance: {
        location: {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        },
        order: 'asc',
        unit: 'km',
      },
    });
  } else {
    // Default sort order when userLocation is not provided
    searchQueryBody.sort.push({
      createdAt: {
        order: 'desc',
      },
    });
  }

  if (searchAfter) {
    searchQueryBody.search_after = searchAfter;
  }

  searchTypeReq.body = JSON.stringify(searchQueryBody);

  const signer = new AWS.Signers.V4(searchTypeReq, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const searchPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      searchTypeReq,
      null,
      httpResp => {
        let responseBody = '';
        httpResp.on('data', chunk => {
          responseBody += chunk;
        });
        httpResp.on('end', chunk => {
          const data = JSON.parse(responseBody);

          console.log(`Search results: ${JSON.stringify(data.hits.hits)}`);

          const homesData = data.hits.hits.map(hit => hit._source);
          const result = {
            homes: homesData,
            searchAfter:
              data.hits.hits.length > 0 ? data.hits.hits[data.hits.hits.length - 1].sort : null,
            count: data.hits.total.value,
          };

          resolve(result);
        });
      },
      reject,
    );
  });

  console.log(`Finished search in OpenSearch index: ${index}`);
  return searchPromise;
}

async function filterHomes(filterParams, userLocation = null, searchAfter = null) {
  console.log(`Starting search in OpenSearch index: ${index}`);

  const searchReq = new AWS.HttpRequest(endpoint);

  searchReq.method = 'POST';
  searchReq.path = path.join('/', index, '_search');
  searchReq.region = 'us-east-2';
  searchReq.headers['presigned-expires'] = false;
  searchReq.headers.Host = endpoint.host;
  searchReq.headers['Content-Type'] = 'application/json';

  const searchQueryBody = {
    size: 30,
    _source: [
      'currency',
      'newPrice',
      'status',
      'phoneNumbers',
      'maxGuests',
      'loyaltyProgram',
      'videoUrl',
      'wifi',
      'image',
      'kitchen',
      'water',
      'bathroom',
      'id',
      'latitude',
      'bed',
      'furnished',
      'mode',
      'negotiable',
      'createdAt',
      'oldPrice',
      'marketerNumber',
      'toilet',
      'aircondition',
      'bathroomNumber',
      'bedroom',
      'locality',
      'updatedAt',
      'userID',
      'longitude',
      'images',
      'description',
      'sublocality',
      'title',
      'type',
      'location',
    ],
    query: {
      bool: {
        filter: [],
      },
    },
    sort: [],
  };

  if (filterParams.type) {
    searchQueryBody.query.bool.filter.push({
      term: {'type.keyword': filterParams.type},
    });
  }

  if (filterParams.bedroom) {
    searchQueryBody.query.bool.filter.push({
      term: {bedroom: filterParams.bedroom},
    });
  }

  if (filterParams.newPrice) {
    searchQueryBody.query.bool.filter.push({
      range: {newPrice: {gte: filterParams.newPrice.min, lte: filterParams.newPrice.max}},
    });
  }

  if (filterParams.mode) {
    searchQueryBody.query.bool.filter.push({
      term: {'mode.keyword': filterParams.mode},
    });
  }

  if (filterParams.furnished) {
    searchQueryBody.query.bool.filter.push({
      term: {'furnished.keyword': filterParams.furnished},
    });
  }

  if (filterParams.negotiable) {
    searchQueryBody.query.bool.filter.push({
      term: {'negotiable.keyword': filterParams.negotiable},
    });
  }

  const amenities = ['wifi', 'aircondition', 'kitchen', 'water', 'toilet'];
  amenities.forEach(amenity => {
    if (filterParams[amenity]) {
      searchQueryBody.query.bool.filter.push({
        term: {[`${amenity}.keyword`]: filterParams[amenity]},
      });
    }
  });

  if (userLocation) {
    searchQueryBody.sort.push({
      _geo_distance: {
        location: {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        },
        order: 'asc',
        unit: 'km',
      },
    });
  } else {
    searchQueryBody.sort.push({
      createdAt: {
        order: 'desc',
      },
    });
  }

  if (searchAfter) {
    searchQueryBody.search_after = searchAfter;
  }

  searchReq.body = JSON.stringify(searchQueryBody);

  const signer = new AWS.Signers.V4(searchReq, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const searchPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      searchReq,
      null,
      httpResp => {
        let responseBody = '';
        httpResp.on('data', chunk => {
          responseBody += chunk;
        });
        httpResp.on('end', chunk => {
          const data = JSON.parse(responseBody);

          console.log(`Filter results: ${JSON.stringify(data.hits.hits)}`);

          const homesData = data.hits.hits.map(hit => hit._source);
          const result = {
            homes: homesData,
            searchAfter:
              data.hits.hits.length > 0 ? data.hits.hits[data.hits.hits.length - 1].sort : null,
            count: data.hits.total.value,
          };

          resolve(result);
        });
      },
      reject,
    );
  });

  console.log(`Finished filtering in OpenSearch index: ${index}`);
  return searchPromise;
}

async function forSale(userLocation = null, searchAfter = null) {
  console.log(`Starting search for sale in OpenSearch index: ${index}`);

  const searchReq = new AWS.HttpRequest(endpoint);

  searchReq.method = 'POST';
  searchReq.path = path.join('/', index, '_search');
  searchReq.region = 'us-east-2';
  searchReq.headers['presigned-expires'] = false;
  searchReq.headers.Host = endpoint.host;
  searchReq.headers['Content-Type'] = 'application/json';

  const searchQueryBody = {
    size: 30,
    _source: [
      'currency',
      'newPrice',
      'status',
      'phoneNumbers',
      'maxGuests',
      'loyaltyProgram',
      'videoUrl',
      'wifi',
      'image',
      'kitchen',
      'water',
      'bathroom',
      'id',
      'latitude',
      'bed',
      'furnished',
      'mode',
      'negotiable',
      'createdAt',
      'oldPrice',
      'marketerNumber',
      'toilet',
      'aircondition',
      'bathroomNumber',
      'bedroom',
      'locality',
      'updatedAt',
      'userID',
      'longitude',
      'images',
      'description',
      'sublocality',
      'title',
      'type',
      'location',
    ],
    query: {
      bool: {
        filter: [
          {
            term: {'mode.keyword': 'For Sale'},
          },
        ],
      },
    },
    sort: [],
  };

  if (userLocation) {
    searchQueryBody.sort.push({
      _geo_distance: {
        location: {
          lat: userLocation.latitude,
          lon: userLocation.longitude,
        },
        order: 'asc',
        unit: 'km',
      },
    });
  }

  searchQueryBody.sort.push({
    createdAt: {
      order: 'desc',
    },
  });

  if (searchAfter) {
    searchQueryBody.search_after = searchAfter;
  }

  searchReq.body = JSON.stringify(searchQueryBody);

  const signer = new AWS.Signers.V4(searchReq, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const searchPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      searchReq,
      null,
      httpResp => {
        let responseBody = '';
        httpResp.on('data', chunk => {
          responseBody += chunk;
        });
        httpResp.on('end', chunk => {
          const data = JSON.parse(responseBody);

          console.log(`Search results: ${JSON.stringify(data.hits.hits)}`);

          const homesData = data.hits.hits.map(hit => hit._source);
          const result = {
            homes: homesData,
            searchAfter:
              data.hits.hits.length > 0 ? data.hits.hits[data.hits.hits.length - 1].sort : null,
            count: data.hits.total.value,
          };

          resolve(result);
        });
      },
      reject,
    );
  });

  console.log(`Finished search for sale in OpenSearch index: ${index}`);
  return searchPromise;
}

async function fetchUnverifiedHomes(userLocation, searchAfter = null) {
  console.log('Starting search in OpenSearch index: rentitnew');

  const searchReq = new AWS.HttpRequest(endpoint);

  searchReq.method = 'POST';
  searchReq.path = path.join('/', 'rentitnew', '_search');
  searchReq.region = 'us-east-2';
  searchReq.headers['presigned-expires'] = false;
  searchReq.headers.Host = endpoint.host;
  searchReq.headers['Content-Type'] = 'application/json';

  const searchQueryBody = {
    size: 30,
    _source: [
      'currency',
      'newPrice',
      'status',
      'phoneNumbers',
      'maxGuests',
      'loyaltyProgram',
      'videoUrl',
      'wifi',
      'image',
      'kitchen',
      'water',
      'bathroom',
      'id',
      'latitude',
      'bed',
      'furnished',
      'mode',
      'negotiable',
      'createdAt',
      'oldPrice',
      'marketerNumber',
      'toilet',
      'aircondition',
      'bathroomNumber',
      'bedroom',
      'locality',
      'updatedAt',
      'userID',
      'longitude',
      'images',
      'description',
      'sublocality',
      'title',
      'type',
      'location',
    ],
    sort: [
      {
        _geo_distance: {
          location: {
            lat: userLocation.latitude,
            lon: userLocation.longitude,
          },
          order: 'asc',
          unit: 'km',
        },
      },
    ],
    query: {
      bool: {
        filter: {
          geo_distance: {
            distance: '5km',
            location: {
              lat: userLocation.latitude,
              lon: userLocation.longitude,
            },
          },
        },
      },
    },
  };

  if (searchAfter) {
    searchQueryBody.search_after = searchAfter;
  }

  searchReq.body = JSON.stringify(searchQueryBody);

  const signer = new AWS.Signers.V4(searchReq, 'es');
  signer.addAuthorization(AWS.config.credentials, new Date());

  const searchPromise = new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      searchReq,
      null,
      httpResp => {
        let responseBody = '';
        httpResp.on('data', chunk => {
          responseBody += chunk;
        });
        httpResp.on('end', chunk => {
          const data = JSON.parse(responseBody);

          console.log(`Search results: ${JSON.stringify(data.hits.hits)}`);

          const homesData = data.hits.hits.map(hit => hit._source);
          const result = {
            homes: homesData,
            searchAfter:
              data.hits.hits.length > 0 ? data.hits.hits[data.hits.hits.length - 1].sort : null,
            count: data.hits.total.value,
          };

          resolve(result);
        });
      },
      reject,
    );
  });

  return searchPromise;
}
