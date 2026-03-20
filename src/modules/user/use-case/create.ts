import { UserRepositoryTypeorm } from '../repository';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepositoryTypeorm) {}
  async execute() {}
}
