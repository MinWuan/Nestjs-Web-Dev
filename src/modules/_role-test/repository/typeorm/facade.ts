import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { RoleTest } from '../../entity';

@Injectable()
export class RoleTestRepositoryFacade {
  constructor(
    @InjectRepository(RoleTest, DOMAIN.test.name)
    private repo: MongoRepository<RoleTest>,
  ) {}
}
