const AWS = require('aws-sdk');
const uuid = require('uuid');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  // Generate a unique file name
  const fileName = uuid.v4() + '.mp4';

  // Define S3 parameters
  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    ContentType: 'video/mp4',
    Expires: 60 * 60, // URL expiration time in seconds (1 hour, for example)
  };

  try {
    // Generate the pre-signed URL
    const preSignedUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pre-signed URL generated successfully.',
        fileName: fileName,
        preSignedUrl: preSignedUrl,
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
};
