const { Auth0Client } = require('@auth0/nextjs-auth0/server');
const auth0 = new Auth0Client();
console.log('auth0.all is function:', typeof auth0.all === 'function');
console.log('auth0.routes keys:', Object.keys(auth0.routes));
console.log('auth0 prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(auth0)));
