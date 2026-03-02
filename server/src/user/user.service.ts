import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private repository: UserRepository) { }

    async synchronizeAuth0User(userData: { auth0Id: string; email: string }) {
        return this.repository.upsert(userData);
    }

    async getUserProfile(id: string) {
        return this.repository.findById(id);
    }
}
