import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private service: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Request() req: any) {
        // Synchronize user on login/profile request
        const user = await this.service.synchronizeAuth0User({
            auth0Id: req.user.sub,
            email: req.user.email,
        });
        return user;
    }
}
