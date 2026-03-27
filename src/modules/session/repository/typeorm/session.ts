import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoRepository,
  SaveOptions,
  UpdateOptions,
  DeleteOptions,
} from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import { Session } from '../../entity';
import { ObjectId } from 'mongodb';
import * as input from '../types/input';
import { SessionRepository } from '../types/implement';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class SessionRepositoryTypeorm implements SessionRepository {
  constructor(
    @InjectRepository(Session, DOMAIN.main.name)
    private repo: MongoRepository<Session>,
    private readonly logger: AppLogger,
  ) {}

  // =================================================================
  // CREATE ONE
  // =================================================================
  async create(data: Partial<Session>): Promise<Session> {
    try {
      const session = this.repo.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedSession = await this.repo.save(session, {
        reload: true, // Tự động load lại entity sau khi lưu để có đầy đủ dữ liệu
        transaction: false, // Tắt transaction để tăng tốc độ
        chunk: 100, // Chia nhỏ nếu có nhiều dữ liệu
        data: { ordered: true }, // Dữ liệu có thứ tự
        listeners: true, // Kích hoạt các listener nếu có
      });
      return savedSession;
    } catch (error) {
      this.logger.error({
        message: `🔴 create session`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // CREATE MANY
  // =================================================================
  async createMany(
    data: Partial<Session>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: Session[] }> {
    try {
      const now = new Date();

      // 1. Map dữ liệu đầu vào thành Entity instances, gán timestamp
      const entities = data.map((item) =>
        this.repo.create({
          ...item,
          createdAt: now,
          updatedAt: now,
        }),
      );

      // 2. Thực hiện lưu hàng loạt (Bulk Write)
      // TypeORM save([]) sẽ tự động thực hiện insertMany xuống MongoDB
      const results = await this.repo.save(entities, {
        reload: false, // Không cần load lại để tiết kiệm tài nguyên
        chunk: 500, // Chia nhỏ nếu có nhiều dữ liệu
        ...options,
      });

      // 3. Chỉ trả về IDs và Count để tối ưu băng thông/RAM
      return {
        ids: results.map((item) => item?._id?.toString()),
        count: results.length,
        data: results,
      };
    } catch (error) {
      this.logger.error({
        message: `🔴 create many sessions`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // UPDATE ONE
  // =================================================================
  async update(
    _id: string,
    data: Partial<Session>,
    options?: SaveOptions,
  ): Promise<Session | null> {
    try {
      const session = await this.repo.findOneBy({ _id: new ObjectId(_id) });
      if (!session) return null;

      // Helper: Loại bỏ undefined keys
      const cleanData = this.cleanPayload(data);

      // Merge dữ liệu mới vào entity cũ
      this.repo.merge(session, cleanData);
      session.updatedAt = new Date();

      const updatedSession = await this.repo.save(session, {
        ...options,
      });
      return updatedSession;
    } catch (error) {
      this.logger.error({
        message: `🔴 update session`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // UPDATE MANY
  // =================================================================
  async updateMany(
    ids: string[],
    data: Partial<Session>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    try {
      const objectIds = ids.map((id) => new ObjectId(id));

      const cleanData = this.cleanPayload(data);

      // Luôn update thời gian
      const updatePayload = {
        ...cleanData,
        updatedAt: new Date(),
      };

      const result = await this.repo.updateMany(
        { _id: { $in: objectIds } },
        { $set: updatePayload },
        {
          ...options,
        },
      );

      return {
        modifiedCount: result.modifiedCount, // Số lượng document thực sự bị thay đổi
        matchedCount: result.matchedCount, // Số lượng document khớp điều kiện
      };
    } catch (error) {
      this.logger.error({
        message: `🔴 update many sessions`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // DELETE ONE
  // =================================================================
  async delete(
    _id: string,
  ): Promise<{ deletedCount: number; acknowledged: boolean }> {
    try {
      const result = await this.repo.deleteOne({
        _id: new ObjectId(_id),
      });
      return {
        deletedCount: result.deletedCount, // Số lượng document đã xóa
        acknowledged: result.acknowledged, // Trạng thái xác nhận từ MongoDB
      };
    } catch (error) {
      this.logger.error({
        message: `🔴 delete session`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // DELETE MANY
  // =================================================================
  async deleteMany(
    ids: string[],
    options?: DeleteOptions,
  ): Promise<{ deletedCount: number; acknowledged: boolean }> {
    try {
      const objectIds = ids.map((id) => new ObjectId(id));

      const result = await this.repo.deleteMany(
        { _id: { $in: objectIds } },
        {
          ...options,
        },
      );

      return {
        deletedCount: result.deletedCount, // Số lượng document đã xóa
        acknowledged: result.acknowledged, // Trạng thái xác nhận từ MongoDB
      };
    } catch (error) {
      this.logger.error({
        message: `🔴 delete many sessions`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // FIND BY ID
  // =================================================================
  async findById(queryDto: input.findById): Promise<Session | null> {
    try {
      const projection = queryDto.select?.length
        ? (queryDto.select as (keyof Session)[])
        : undefined;

      const session = await this.repo.findOne({
        where: { _id: new ObjectId(queryDto._id) },
        select: projection,
      });
      return session;
    } catch (error) {
      this.logger.error({
        message: `🔴 find by id session`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // FIND ALL)
  // =================================================================
  async findAll(queryDto: input.findAll): Promise<{
    data: Session[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const {
        page = 1,
        limit = 20,
        filters,
        search,
        range,
        sort,
        select,
      } = queryDto;

      const MAX_LIMIT = 100;
      const safeLimit = Math.min(limit, MAX_LIMIT);
      const skip = (page - 1) * safeLimit;

      const where: any = {};

      /* =========================
       * FILTER CƠ BẢN (field = value)
       * ========================= */
      if (filters) {
        for (const [key, value] of Object.entries(filters)) {
          if (value !== undefined && value !== null) {
            where[key] = value;
          }
        }
      }

      /* =========================
       * SEARCH TEXT
       * ========================= */
      if (search?.keyword && search.fields?.length) {
        where.$or = search.fields.map((field) => ({
          [field]: { $regex: search.keyword, $options: 'i' },
        }));
      }

      /* =========================
       * RANGE FILTER (date, number)
       * ========================= */
      if (range) {
        for (const [field, condition] of Object.entries(range)) {
          if (!condition) continue;

          where[field] = {};
          if (condition.from !== undefined) {
            where[field].$gte = condition.from;
          }
          if (condition.to !== undefined) {
            where[field].$lte = condition.to;
          }
        }
      }

      /* =========================
       * SORT
       * ========================= */
      const order: any = {};
      if (sort?.field) {
        order[sort.field as string] = sort.order === 'ASC' ? 1 : -1;
      } else {
        order.createdAt = -1; // default
      }

      /* =========================
       * SELECT
       * ========================= */

      const projection = select?.length
        ? (select as (keyof Session)[])
        : undefined;

      /* =========================
       * QUERY
       * ========================= */
      const [data, total] = await Promise.all([
        this.repo.find({
          where,
          skip,
          take: limit,
          order,
          select: projection,
        }),
        this.repo.count({
          ...where,
        }),
      ]);

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error({
        message: `🔴 find all sessions`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // HELPER (Làm sạch payload để loại bỏ các trường undefined hoặc null)
  // =================================================================
  private cleanPayload(data: any): any {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined || cleaned[key] === null) {
        delete cleaned[key];
      }
    });
    return cleaned;
  }

  // =================================================================
  // FIND MANY BY IDS (Sử dụng cho DataLoader)
  // =================================================================
  async findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<Session[]> {
    try {
      const sessions = await this.repo.find({
        where: {
          _id: { $in: data.ids.map((id) => new ObjectId(id)) },
        },
        select: data?.select?.length ? data.select : undefined,
      });
      return sessions;
    } catch (error) {
      this.logger.error({
        message: `🔴 find many by ids sessions`,
        trace: error,
      });
      throw error;
    }
  }
}
