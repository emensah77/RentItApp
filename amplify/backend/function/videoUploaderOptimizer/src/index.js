const AWS = require('aws-sdk');
const uuid = require('uuid');
const fs = require('fs');
const { Readable } = require('stream');
const multipart = require('lambda-multipart-parser');

const s3 = new AWS.S3();

exports.handler = async (event) => {
  const result = await multipart.parse(event, false);

  if (!result.files || !result.files[0]) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'No video file found in the request.',
      }),
    };
  }

  const videoFile = result.files[0];
  const buffer = videoFile.content;

  const fileName = uuid.v4() + '.mp4';
  const params = {
    Bucket: 'videosrentit',
    Key: `video/${fileName}`,
    Body: buffer,
    ContentType: 'video/mp4',
  };

  try {
    await s3.putObject(params).promise();

    const cloudFrontDomain = 'd1mgzi0ytcdaf9.cloudfront.net';
    const videoUrl = `https://${cloudFrontDomain}/${params.Key}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Video uploaded successfully.',
        fileName: fileName,
        videoUrl: videoUrl,
      }),
    };
  } catch (error) {
    console.error('Error uploading video:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while uploading the video.',
      }),
    };
  }
};
