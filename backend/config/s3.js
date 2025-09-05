import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();


console.log("Region:", process.env.AWS_REGION);
console.log("Bucket:", process.env.AWS_BUCKET_NAME);

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;
