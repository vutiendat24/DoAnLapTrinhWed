import dotenv from 'dotenv';
import path from 'path';
import neo4j from 'neo4j-driver';

// Load biến môi trường từ file .env (lùi về 2 cấp thư mục)
dotenv.config({ path: path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.env') });


const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;



const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

export default driver;
