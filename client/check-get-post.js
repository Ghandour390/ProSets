const { Auth0Client } = require('@auth0/nextjs-auth0/server');
const auth0 = new Auth0Client();
console.log('auth0.GET is function:', typeof auth0.GET === 'function');
console.log('auth0.POST is function:', typeof auth0.POST === 'function');
console.log('auth0.middleware is function:', typeof auth0.middleware === 'function');
