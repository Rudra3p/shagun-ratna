import { s3Client } from "./r2"; // Importing your s3Client from the previous step
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Generates a signed URL for uploading a file directly to R2.
 * @param {string} fileName - The unique key we generated (e.g., 'products/12345-ring.jpg')
 * @param {string} fileType - The file format (e.g., 'image/jpeg')
 */
export async function generateUploadUrl(fileName, fileType) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fileName,
    ContentType: fileType,
  });

  // This creates a secure, temporary URL that expires in 60 seconds.
  // The user's browser uses this URL to "PUT" the image directly into R2.
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
  
  return signedUrl;
}