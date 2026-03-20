import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { S3 } from '../../entity';

@Injectable()
export class S3RepositoryFacade {
  constructor(
    @InjectRepository(S3, DOMAIN.main.name)
    private repo: MongoRepository<S3>,
  ) {}
}
