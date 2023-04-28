const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3();

exports.handler = async event => {
  if (!event.queryStringParameters) {
    // If queryStringParameters does not exist, use the old method
    return await getPresignedUrlForOldMethod();
  }

  const {method, partNumber} = event.queryStringParameters;

  if (method === 'initiate') {
    return await initiateMultipartUpload();
  }
  if (method === 'part') {
    return await getPresignedUrlForPart(event, partNumber);
  }
  if (method === 'complete') {
    const {uploadId, parts} = JSON.parse(event.body);
    return await completeMultipartUpload(event, uploadId, parts);
  }
  return {
    statusCode: 400,
    body: JSON.stringify({message: 'Invalid method provided.'}),
  };
};

async function initiateMultipartUpload() {
  const fileName = `${uuid.v4()}.mp4`;

  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    ContentType: 'video/mp4',
  };

  try {
    const response = await s3.createMultipartUpload(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Multipart upload initiated successfully.',
        fileName,
        uploadId: response.UploadId,
      }),
    };
  } catch (error) {
    console.error('Error initiating multipart upload:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while initiating the multipart upload.',
      }),
    };
  }
}

async function getPresignedUrlForPart(event, partNumber) {
  const {fileName, uploadId} = event.queryStringParameters;

  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    UploadId: uploadId,
    PartNumber: partNumber,
  };

  try {
    const preSignedUrl = await s3.getSignedUrlPromise('uploadPart', params);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pre-signed URL for part generated successfully.',
        preSignedUrl,
      }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL for part:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          'An error occurred while generating the pre-signed URL for part.',
      }),
    };
  }
}

async function getPresignedUrlForOldMethod() {
  const fileName = `${uuid.v4()}.mp4`;

  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    ContentType: 'video/mp4',
    Expires: 60 * 60, // URL expiration time in seconds (1 hour, for example)
  };

  try {
    const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pre-signed URL generated successfully.',
        fileName,
        preSignedUrl,
      }),
    };
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while generating the pre-signed URL.',
      }),
    };
  }
}

async function completeMultipartUpload(event, uploadId, parts) {
  const {fileName} = event.queryStringParameters;

  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  try {
    await s3.completeMultipartUpload(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Multipart upload completed successfully.',
        videoUrl: `https://d1mgzi0ytcdaf9.cloudfront.net/video/${fileName}`,
      }),
    };
  } catch (error) {
    console.error('Error completing multipart upload:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while completing the multipart upload.',
      }),
    };
  }
}
