const AWS = require('aws-sdk');
const https = require('https');
const url = require('url');
const path = require('path');

const { unmarshall } = AWS.DynamoDB.Converter;

AWS.config.update({
  region: 'us-east-2',
});

const opensearchDomain = 'https://search-rentit-kigszj3wbqqurgdplgmtk3bkqa.us-east-2.es.amazonaws.com';
const index = 'rentit';
const endpoint = new AWS.Endpoint(opensearchDomain);

exports.handler = async (record) => {
  console.log('Processing record:', JSON.stringify(record, null, 2));

  // Unmarshall the DynamoDB data to JSON
  const doc = record.dynamodb.NewImage ? unmarshall(record.dynamodb.NewImage) : null;
  const oldDoc = record.dynamodb.OldImage ? unmarshall(record.dynamodb.OldImage) : null;

  switch (record.eventName) {
    case 'INSERT':
      console.log(`Posting document to OpenSearch: ${JSON.stringify(doc)}`);
      try {
        await postDocumentToOpenSearch(doc);
        console.log(`Finished posting document to OpenSearch: ${JSON.stringify(doc)}`);
      } catch (error) {
        console.error(`Error posting document to OpenSearch: ${error}`);
      }
      break;
    case 'MODIFY':
      console.log(`Modifying document in OpenSearch: ${JSON.stringify(doc)}`);
      try {
        await modifyDocumentInOpenSearch(doc);
        console.log(`Finished modifying document in OpenSearch: ${JSON.stringify(doc)}`);
      } catch (error) {
        console.error(`Error modifying document in OpenSearch: ${error}`);
      }
      break;
    case 'REMOVE':
      console.log(`Deleting document from OpenSearch: ${JSON.stringify(oldDoc)}`);
      try {
        await deleteDocumentFromOpenSearch(oldDoc.id);
        console.log(`Finished deleting document from OpenSearch: ${oldDoc.id}`);
      } catch (error) {
        console.error(`Error deleting document from OpenSearch: ${error}`);
      }
      break;
    default:
      console.log(`Ignoring event type: ${record.eventName}`);
  }
};
async function postDocumentToOpenSearch(doc) {
  console.log(`Starting postDocumentToOpenSearch for document: ${JSON.stringify(doc)}`);

  const postReq = new AWS.HttpRequest(endpoint);

  postReq.method = 'POST';
  postReq.path = path.join('/', index, '_doc', doc.id); // Use the document ID in the path
  postReq.region = 'us-east-2';
  postReq.headers['presigned-expires'] = false;
  postReq.headers.Host = endpoint.host;
  postReq.headers['Content-Type'] = 'application/json';
  postReq.body = JSON.stringify({
    ...doc,
    location: { lat: doc.latitude, lon: doc.longitude },
  });

  const postSigner = new AWS.Signers.V4(postReq, 'es');
  postSigner.addAuthorization(AWS.config.credentials, new Date());

  return new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      postReq,
      null,
      (httpResp) => {
        let body = '';
        httpResp.on('data', (chunk) => {
          body += chunk;
        });
        httpResp.on('end', () => {
          console.log(`Response body: ${body}`);
          console.log(`Finished postdocument for doc: ${JSON.stringify(doc)}`);
          resolve(body);
        });
      },
      (error) => {
        console.error(`Error in HttpRequest: ${JSON.stringify(error)}`);
        reject(error);
      },
    );
  });
}

async function modifyDocumentInOpenSearch(doc) {
  console.log(`Starting modifyDocumentInOpenSearch for document: ${JSON.stringify(doc)}`);

  const modifyReq = new AWS.HttpRequest(endpoint);

  modifyReq.method = 'PUT'; // Use PUT for modifying existing documents
  modifyReq.path = path.join('/', index, '_doc', doc.id); // Use the document ID in the path
  modifyReq.region = 'us-east-2';
  modifyReq.headers['presigned-expires'] = false;
  modifyReq.headers.Host = endpoint.host;
  modifyReq.headers['Content-Type'] = 'application/json';
  modifyReq.body = JSON.stringify({
    ...doc,
    location: { lat: doc.latitude, lon: doc.longitude },
  });

  const modifySigner = new AWS.Signers.V4(modifyReq, 'es');
  modifySigner.addAuthorization(AWS.config.credentials, new Date());

  return new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      modifyReq,
      null,
      (httpResp) => {
        let body = '';
        httpResp.on('data', (chunk) => {
          body += chunk;
        });
        httpResp.on('end', () => {
          console.log(`Response body: ${body}`);
          console.log(`Finished modifyDocument for doc: ${JSON.stringify(doc)}`);
          resolve(body);
        });
      },
      (error) => {
        console.error(`Error in HttpRequest: ${JSON.stringify(error)}`);
        reject(error);
      },
    );
  });
}

async function deleteDocumentFromOpenSearch(docId) {
  console.log(`Starting deleteDocumentFromOpenSearch for document ID: ${docId}`);

  const deleteReq = new AWS.HttpRequest(endpoint);

  deleteReq.method = 'DELETE'; // Use DELETE for deleting documents
  deleteReq.path = path.join('/', index, '_doc', docId); // Use the document ID in the path
  deleteReq.region = 'us-east-2';
  deleteReq.headers['presigned-expires'] = false;
  deleteReq.headers.Host = endpoint.host;
  deleteReq.headers['Content-Type'] = 'application/json';

  const deleteSigner = new AWS.Signers.V4(deleteReq, 'es');
  deleteSigner.addAuthorization(AWS.config.credentials, new Date());

  return new Promise((resolve, reject) => {
    const send = new AWS.NodeHttpClient();
    send.handleRequest(
      deleteReq,
      null,
      (httpResp) => {
        let body = '';
        httpResp.on('data', (chunk) => {
          body += chunk;
        });
        httpResp.on('end', () => {
          console.log(`Response body: ${body}`);
          console.log(`Finished deleteDocument for doc ID: ${docId}`);
          resolve(body);
        });
      },
      (error) => {
        console.error(`Error in HttpRequest: ${JSON.stringify(error)}`);
        reject(error);
      },
    );
  });
}
