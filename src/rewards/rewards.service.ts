import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {

    public grantTo() {
        console.log('Reward granted!');
    }
}
