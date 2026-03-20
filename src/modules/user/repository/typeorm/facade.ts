import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { User } from '../../entity';

@Injectable()
export class UserRepositoryFacade {
  constructor(
    @InjectRepository(User, DOMAIN.main.name)
    private repo: MongoRepository<User>,
  ) {}
}
