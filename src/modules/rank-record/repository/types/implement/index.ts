

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { RankRecord } from '../../../entity';
import * as input from '../input';

export interface RankRecordRepository {
  // CREATE
  create(data: Partial<RankRecord>): Promise<RankRecord>;
  createMany(
    data: Partial<RankRecord>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: RankRecord[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<RankRecord>,
    options?: SaveOptions,
  ): Promise<RankRecord | null>;
  updateMany(
    ids: string[],
    data: Partial<RankRecord>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<RankRecord | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: RankRecord[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<RankRecord[]>;
}