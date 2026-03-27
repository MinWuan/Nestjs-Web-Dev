import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { RankRecord } from '../../entity';

@Injectable()
export class RankRecordRepositoryFacade {
  constructor(
    @InjectRepository(RankRecord, DOMAIN.main.name)
    private repo: MongoRepository<RankRecord>,
  ) {}
}
