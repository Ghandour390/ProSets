const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://user:password@localhost:5433/mydb?schema=public"
});

client.connect()
    .then(() => {
        console.log('✅ Connection successful!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
