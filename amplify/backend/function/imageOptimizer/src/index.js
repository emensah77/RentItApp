const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Sharp = require('sharp');
const DynamoDB = new AWS.DynamoDB.DocumentClient();

let counter = 0;

async function isImageProcessed(imageKey) {
  const params = {
    TableName: 'ProcessedImages',
    Key: { imageKey },
  };

  try {
    const result = await DynamoDB.get(params).promise();
    return !!result.Item;
  } catch (error) {
    console.error('Error checking if image is processed:', error);
    return null;
  }
}

async function markImageAsProcessed(imageKey) {
  const params = {
    TableName: 'ProcessedImages',
    Item: { imageKey },
  };

  try {
    await DynamoDB.put(params).promise();
  } catch (error) {
    console.error('Error marking image as processed:', error);
  }
}

exports.handler = async (event) => {
  console.log('Received event:', event);

  try {
    const bucket = event.Records[0].s3.bucket.name;
    const subfolder = event.subfolder;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log('Object key:', key);
    const fullKey = key.startsWith(subfolder) ? key : `${subfolder}/${key}`;
    console.log('Full key:', fullKey);

    const isProcessed = await isImageProcessed(fullKey);
    if (isProcessed) {
      console.log(`Image ${fullKey} has already been processed.`);
      return {
        statusCode: 300,
        body: JSON.stringify({ message: `Image ${fullKey} has already been processed.` }),
        };
    }

    const imageObject = await S3.getObject({ Bucket: bucket, Key: fullKey, }).promise();
    const inputImageBuffer = imageObject.Body;

    const imageMetadata = await Sharp(inputImageBuffer).metadata();
    console.log(`Image format: ${imageMetadata.format}`);


    if (['jpeg', 'png', 'webp', 'tiff'].includes(imageMetadata.format)) {
      try {
        const optimizedImageBuffer = await Sharp(inputImageBuffer)
          .resize(1024, 683, { withoutEnlargement: true, fit: 'inside' })
          .jpeg({ quality: 75 })
          .toBuffer();

        const originalSize = inputImageBuffer.length;
        const optimizedSize = optimizedImageBuffer.length;
        const sizeReductionPercentage = ((originalSize - optimizedSize) / originalSize) * 100;
        const optimizedUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fullKey}`;

        await S3.putObject({
          Body: optimizedImageBuffer,
          Bucket: bucket,
          ContentType: 'image/jpeg',
          Key: fullKey,
        }).promise();

        await markImageAsProcessed(fullKey);
        counter++;

        console.log(`Optimized image uploaded to ${bucket}/${fullKey}. Size reduction: ${sizeReductionPercentage.toFixed(2)}%`);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Optimized image uploaded to ${bucket}/${fullKey}. Size reduction: ${sizeReductionPercentage.toFixed(2)}%`,
            optimizedUrl: optimizedUrl,
            originalSize: originalSize,
            optimizedSize: optimizedSize,
            sizeReduction: sizeReductionPercentage.toFixed(2),
            optimizedCount: counter,
          }),
        };
      } catch (error) {
        console.error('Error during image processing:', error);
        const response = {
          statusCode: 500,
          body: JSON.stringify({ message: 'An error occurred during image processing' }),
        };
        return response;
     
    }
} else {
  console.log(`Skipping unsupported image format: ${imageMetadata.format}`);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Skipped unsupported image format: ${imageMetadata.format}` }),
  };
}
} catch (error) {
    console.error('Error in handler:', error);
    console.log(`Error processing image: ${fullKey}`);

    return {
    statusCode: 500,
    body: JSON.stringify({ message: error }),
    };
    }
    };