require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const neo4j = require('neo4j-driver');

const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

console.log("Connecting to Neo4j with:", {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
});

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

module.exports = driver;
