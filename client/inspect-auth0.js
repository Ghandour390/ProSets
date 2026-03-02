const auth0Server = require('@auth0/nextjs-auth0/server');
console.log('Server exports:', Object.keys(auth0Server));

try {
    const { Auth0Client } = auth0Server;
    const auth0 = new Auth0Client();
    console.log('Auth0Client instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(auth0)));
} catch (e) {
    console.log('Error inspecting Auth0Client:', e.message);
}
