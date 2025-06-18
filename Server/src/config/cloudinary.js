import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
import path from 'path';

// Load biến môi trường từ file .env (lùi về 2 cấp thư mục)
dotenv.config({ path: path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.env') });


const cloud_name= process.env.CLOUD_NAME;
const api_key = process.env.API_KEY ;
const api_secret= process.env.API_SECRET;

console.log("Connecting to cloudinary with:", {
  cloud_name,
  api_key,
  api_secret
});

cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

export default cloudinary;