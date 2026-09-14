import { NftAchievementRepositoryTypeorm } from '../repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateNftAchievementUseCase {
  constructor(private nftAchievementRepository: NftAchievementRepositoryTypeorm) {}
  async execute() {}
}
