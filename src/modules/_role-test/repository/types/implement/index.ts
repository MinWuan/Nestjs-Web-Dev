

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { RoleTest } from '../../../entity';
import * as input from '../input';

export interface RoleTestRepository {
  // CREATE
  create(data: Partial<RoleTest>): Promise<RoleTest>;
  createMany(
    data: Partial<RoleTest>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: RoleTest[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<RoleTest>,
    options?: SaveOptions,
  ): Promise<RoleTest | null>;
  updateMany(
    ids: string[],
    data: Partial<RoleTest>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<RoleTest | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: RoleTest[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<RoleTest[]>;
}