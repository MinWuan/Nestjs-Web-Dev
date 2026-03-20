

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { Demo } from '../../../entity';
import * as input from '../input';

export interface DemoRepository {
  // CREATE
  create(data: Partial<Demo>): Promise<Demo>;
  createMany(
    data: Partial<Demo>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: Demo[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<Demo>,
    options?: SaveOptions,
  ): Promise<Demo | null>;
  updateMany(
    ids: string[],
    data: Partial<Demo>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<Demo | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: Demo[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<Demo[]>;
}