import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { NftAchievement } from '../../entity';

@Injectable()
export class NftAchievementRepositoryFacade {
  constructor(
    @InjectRepository(NftAchievement, DOMAIN.main.name)
    private repo: MongoRepository<NftAchievement>,
  ) {}
}
