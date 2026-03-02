import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Strategy } from './auth0.strategy';
import { RolesGuard } from './roles.guard';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [Auth0Strategy, RolesGuard],
    exports: [PassportModule, RolesGuard],
})
export class AuthModule { }
