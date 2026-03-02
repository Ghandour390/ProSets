const { Auth0Client } = require('@auth0/nextjs-auth0/server');
const auth0 = new Auth0Client();
console.log('Auth0Client keys:', Object.keys(auth0));
console.log('Auth0Client proto keys:', Object.keys(Object.getPrototypeOf(auth0)));
