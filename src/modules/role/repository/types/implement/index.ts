

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { Role } from '../../../entity';
import * as input from '../input';

export interface RoleRepository {
  // CREATE
  create(data: Partial<Role>): Promise<Role>;
  createMany(
    data: Partial<Role>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: Role[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<Role>,
    options?: SaveOptions,
  ): Promise<Role | null>;
  updateMany(
    ids: string[],
    data: Partial<Role>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<Role | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: Role[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<Role[]>;
}