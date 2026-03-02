const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5434,
  database: 'prosets',
  user: 'postgres',
  password: 'testpass123'
});

client.connect()
  .then(() => {
    console.log('✓ Connected successfully');
    return client.query('SELECT version()');
  })
  .then(res => {
    console.log('✓ Query result:', res.rows[0].version);
    client.end();
  })
  .catch(err => {
    console.error('✗ Connection error:', err.message);
    console.error('Full error:', err);
    client.end();
  });
