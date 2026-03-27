import { SessionRepositoryTypeorm } from '../repository';

export class CreateSessionUseCase {
  constructor(private sessionRepository: SessionRepositoryTypeorm) {}
  async execute() {}
}
