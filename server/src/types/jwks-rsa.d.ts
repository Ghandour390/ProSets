declare module 'jwks-rsa' {
  import { ClientRequest } from 'http';

  export interface JwksClientOptions {
    jwksUri: string;
    cache?: boolean;
    cacheMaxEntries?: number;
    cacheMaxAge?: number;
    rateLimit?: boolean;
    jwksRequestsPerMinute?: number;
    requestHeaders?: Record<string, string>;
    timeout?: number;
  }

  export interface SigningKey {
    kid: string;
    nbf?: number;
    publicKey?: string;
    rsaPublicKey?: string;
  }

  export class JwksClient {
    constructor(options: JwksClientOptions);
    getSigningKey(kid: string, cb: (err: Error | null, key: SigningKey) => void): void;
    getSigningKeyAsync(kid: string): Promise<SigningKey>;
  }

  export function passportJwtSecret(options: {
    jwksUri: string;
    cache?: boolean;
    rateLimit?: boolean;
    jwksRequestsPerMinute?: number;
  }): (header: any, callback: (err: any, secret?: string) => void) => void;
}