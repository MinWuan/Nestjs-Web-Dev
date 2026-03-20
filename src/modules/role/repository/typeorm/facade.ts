import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Role } from '../../entity';

@Injectable()
export class RoleRepositoryFacade {
  constructor(
    @InjectRepository(Role, DOMAIN.main.name)
    private repo: MongoRepository<Role>,
  ) {}
}
