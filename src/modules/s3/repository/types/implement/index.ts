

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { S3 } from '../../../entity';
import * as input from '../input';

export interface S3Repository {
  // CREATE
  create(data: Partial<S3>): Promise<S3>;
  createMany(
    data: Partial<S3>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: S3[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<S3>,
    options?: SaveOptions,
  ): Promise<S3 | null>;
  updateMany(
    ids: string[],
    data: Partial<S3>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<S3 | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: S3[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<S3[]>;
}