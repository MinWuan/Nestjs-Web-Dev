import { RankRecordRepositoryTypeorm } from '../repository';

export class UpsertRankRecordUseCase {
  constructor(private rankRecordRepository: RankRecordRepositoryTypeorm) {}
  async execute() {}
}
