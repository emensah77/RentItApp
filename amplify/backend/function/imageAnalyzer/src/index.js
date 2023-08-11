const AWS = require('aws-sdk');
const exifParser = require('exif-parser');

// Configure AWS SDK with your credentials
AWS.config.update({
  region: 'us-east-2',
});

const s3 = new AWS.S3();

const params = {
  Bucket: 'pics175634-dev',
  Prefix: 'public/', // specify the "folder" where the images are stored
};

async function getObject(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

async function listAllKeys(marker, keys, maxKeys) {
  return new Promise((resolve, reject) => {
    if (keys.length >= maxKeys) {
      resolve(keys);
      return;
    }

    s3.listObjectsV2(
      { Bucket: params.Bucket, Prefix: params.Prefix, ContinuationToken: marker },
      async (err, data) => {
        if (err) {
          console.log('Error listing S3 objects:', err);
          reject(err);
        } else {
          keys = keys.concat(data.Contents.slice(0, maxKeys - keys.length));

          console.log(`Fetched ${data.Contents.length} keys, ${keys.length} total`);

          if (data.IsTruncated && keys.length < maxKeys) {
            keys = await listAllKeys(data.NextContinuationToken, keys, maxKeys);
            resolve(keys);
          } else {
            resolve(keys);
          }
        }
      },
    );
  });
}

exports.handler = async (event) => {
  console.log('Starting function execution');
  let processedImages = 0;

  // Fetch all keys
  const allKeys = await listAllKeys(null, [], 10);

  console.log(`Total keys to process: ${allKeys.length}`);

  // Iterate over each key:
  for (let i = 0; i < allKeys.length; i++) {
    const params = {
      Bucket: 'pics175634-dev',
      Key: allKeys[i].Key,
    };

    console.log(`Processing key: ${allKeys[i].Key}`);

    try {
      const data = await getObject(params);
      console.log(`Successfully retrieved object ${allKeys[i].Key}`);
      const parser = exifParser.create(data.Body);
      const result = parser.parse();
      console.log(`EXIF data for ${allKeys[i].Key}:`, result);
      processedImages++; // Increment counter after successful processing
    } catch (err) {
      console.log(`Error getting or processing object ${allKeys[i].Key}:`, err);
    }
  }

  console.log(`Processed ${processedImages} images`);
};
