const { Auth0Client } = require('@auth0/nextjs-auth0/server');
const auth0 = new Auth0Client();
console.log('Auth0 routes:', auth0.routes);
console.log('Auth0 routes keys:', Object.keys(auth0.routes));
