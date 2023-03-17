/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 const AWS = require('aws-sdk');
 const S3 = new AWS.S3();
 const Sharp = require('sharp');
 
 exports.handler = async (event) => {
   const bucket = event.Records[0].s3.bucket.name;
   const folderName = event.Records[0].s3.folder.name;
   const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
   const fullKey = folderName ? `${folderName}/${key}` : key;
 
   try {
     // Get the image from S3
     const imageObject = await S3.getObject({ Bucket: bucket, Key: fullKey }).promise();
     const inputImageBuffer = imageObject.Body;
 
     // Resize and compress the image using Sharp
     const optimizedImageBuffer = await Sharp(inputImageBuffer)
       .resize(1440, null, { withoutEnlargement: true }) // Resize the image to 1440px wide, maintaining aspect ratio
       .jpeg({ quality: 80 }) // Compress the image using JPEG format with 80% quality
       .toBuffer();
 
     // Calculate the size reduction percentage
     const originalSize = inputImageBuffer.length;
     const optimizedSize = optimizedImageBuffer.length;
     const sizeReductionPercentage = ((originalSize - optimizedSize) / originalSize) * 100;

     // Upload the optimized image back to S3, overwriting the original image
     await S3.putObject({
       Body: optimizedImageBuffer,
       Bucket: bucket,
       ContentType: 'image/jpeg',
       Key: fullKey,
     }).promise();
 
     console.log(`Optimized image uploaded to ${bucket}/${fullKey}. Size reduction: ${sizeReductionPercentage.toFixed(2)}%`);
   } catch (error) {
     console.error(`Error processing image: ${error}`);
   }
 };
