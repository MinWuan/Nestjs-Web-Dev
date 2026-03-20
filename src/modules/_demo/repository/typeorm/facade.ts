import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Demo } from '../../entity';

@Injectable()
export class DemoRepositoryFacade {
  constructor(
    @InjectRepository(Demo, DOMAIN.test.name)
    private repo: MongoRepository<Demo>,
  ) {}
}
