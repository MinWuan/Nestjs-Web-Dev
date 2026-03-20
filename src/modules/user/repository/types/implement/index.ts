

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { User } from '../../../entity';
import * as input from '../input';

export interface UserRepository {
  // CREATE
  create(data: Partial<User>): Promise<User>;
  createMany(
    data: Partial<User>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: User[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<User>,
    options?: SaveOptions,
  ): Promise<User | null>;
  updateMany(
    ids: string[],
    data: Partial<User>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<User | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<User[]>;
}