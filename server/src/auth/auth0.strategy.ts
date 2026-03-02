import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const domain = configService.get<string>('AUTH0_DOMAIN');
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get<string>('AUTH0_AUDIENCE'),
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // Upsert user in DB and attach dbId + role to request
    const user = await this.prisma.user.upsert({
      where: { auth0Id: payload.sub },
      update: {},
      create: {
        auth0Id: payload.sub,
        email: payload.email || `${payload.sub}@auth0.user`,
        role: 'BUYER',
      },
    });

    return {
      sub: payload.sub,
      email: payload.email,
      dbId: user.id,
      role: user.role,
    };
  }
}
