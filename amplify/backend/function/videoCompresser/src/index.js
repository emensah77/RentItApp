const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath('/opt/bin/ffmpeg');

const INPUT_BUCKET = 'videosrentit';
const OUTPUT_BUCKET = 'pics175634-dev';

const { Readable } = require('stream');

async function downloadFile(bucket, key) {
    return new Promise((resolve, reject) => {
      const params = { Bucket: bucket, Key: key };
      const chunks = [];
  
      s3.getObject(params).createReadStream()
        .on('data', chunk => {
          chunks.push(chunk);
        })
        .on('end', () => {
          resolve(Buffer.concat(chunks));
        })
        .on('error', err => {
          reject(err);
        });
    });
  }
  

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const s3Event = event.Records[0].s3;
  const originalKey = s3Event.object.key;
  
  const getObjectParams = {
    Bucket: INPUT_BUCKET,
    Key: originalKey,
  };

  try {
    const data = await s3.getObject(getObjectParams).promise();
    console.log('Data from S3:', data); // Add this line  

    const compressedVideoBuffer = await compressVideo(data.Body);

    const putObjectParams = {
      Bucket: OUTPUT_BUCKET,
      Key: originalKey, // Use the same key as the original file
      Body: compressedVideoBuffer,
    };

    await s3.putObject(putObjectParams).promise();

    console.log('Compressed video uploaded:', originalKey);
    return {
      statusCode: 200,
    };
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
};

async function compressVideo(buffer) {
  return new Promise((resolve, reject) => {
    const inputFile = '/tmp/input.mp4';
    fs.writeFileSync(inputFile, buffer);

    const outputFile = '/tmp/output.mp4';

    ffmpeg(inputFile)
      .inputOptions('-f mp4')
      .outputOptions(['-c:v libx264', '-preset veryfast', '-crf 23'])
      .output(outputFile)
      .on('end', () => {
        resolve(fs.readFileSync(outputFile));
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}
