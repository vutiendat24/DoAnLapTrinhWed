const driver = require('../config/neo4j');
const session = driver.session();

session.run('RETURN 1 AS result')
  .then(res => {
    console.log('Neo4j connection OK:', res.records[0].get('result'));
  })
  .catch(err => {
    console.error('Neo4j connection failed:', err);
  })
  .finally(() => session.close());
