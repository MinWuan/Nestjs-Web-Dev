import { RoleRepositoryTypeorm } from '../repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateRoleUseCase {
  constructor(private roleRepository: RoleRepositoryTypeorm) {}
  async execute() {}
}
