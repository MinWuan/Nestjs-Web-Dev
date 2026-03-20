import { DemoRepositoryTypeorm } from '../repository';

export class CreateDemoUseCase {
  constructor(private demoRepository: DemoRepositoryTypeorm) {}
  async execute() {}
}
