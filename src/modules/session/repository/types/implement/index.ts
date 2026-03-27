

import { SaveOptions, UpdateOptions, DeleteOptions } from 'typeorm';
import { Session } from '../../../entity';
import * as input from '../input';

export interface SessionRepository {
  // CREATE
  create(data: Partial<Session>): Promise<Session>;
  createMany(
    data: Partial<Session>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: Session[] }>;

  // UPDATE
  update(
    _id: string,
    data: Partial<Session>,
    options?: SaveOptions,
  ): Promise<Session | null>;
  updateMany(
    ids: string[],
    data: Partial<Session>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }>;

  // DELETE
  delete(_id: string): Promise<{ deletedCount: number; acknowledged: boolean }>;
  deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }>;

  // FIND
  findById(queryDto: input.findById): Promise<Session | null>;
  findAll(queryDto: input.findAll): Promise<{
    data: Session[];
    total: number;
    page: number;
    limit: number;
  }>;
  findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<Session[]>;
}