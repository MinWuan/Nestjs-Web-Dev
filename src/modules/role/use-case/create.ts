import { RoleRepositoryTypeorm } from '../repository';

export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepositoryTypeorm) {}
  async execute() {}
}
