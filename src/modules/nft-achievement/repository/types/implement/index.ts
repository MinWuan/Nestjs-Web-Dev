

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { NftAchievement } from '../../../entity';
import * as input from '../input';

export interface NftAchievementRepository {
  // CREATE
  create(data: Partial<NftAchievement>): Promise<NftAchievement>;
  createMany(
    data: Partial<NftAchievement>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: NftAchievement[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<NftAchievement>,
    options?: SaveOptions,
  ): Promise<NftAchievement | null>;
  updateMany(
    ids: string[],
    data: Partial<NftAchievement>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<NftAchievement | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: NftAchievement[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<NftAchievement[]>;
}