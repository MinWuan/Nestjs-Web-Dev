import { RankRecordRepositoryTypeorm } from '../repository';

export class CreateRankRecordUseCase {
  constructor(private rankRecordRepository: RankRecordRepositoryTypeorm) {}
  async execute() {}
}
