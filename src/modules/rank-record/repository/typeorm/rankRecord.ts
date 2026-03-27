import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MongoRepository,
  SaveOptions,
  UpdateOptions,
  DeleteOptions,
} from 'typeorm';
import { DOMAIN } from '@/common/constants/common';

import {
  RankRecord,
  TOTAL_UPTIME_STATUS,
  TotalUptimeStatus_Leaderboard_RankRecord,
  LeaderboardRankRecord,
  TotalUptimeStatusEnum,
} from '../../entity';
import { ObjectId } from 'mongodb';
import * as input from '../types/input';
import { RankRecordRepository } from '../types/implement';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RankRecordEvent } from '../../event-handler';
import { AppLogger } from '@/common/logger/app.logger';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RankRecordRepositoryTypeorm implements RankRecordRepository {
  constructor(
    @InjectRepository(RankRecord, DOMAIN.main.name)
    private repo: MongoRepository<RankRecord>,
    private eventEmitter: EventEmitter2,
    private logger: AppLogger,
  ) {}

  // =================================================================
  // CREATE ONE
  // =================================================================
  async create(data: Partial<RankRecord>): Promise<RankRecord> {
    try {
      const rankRecord = this.repo.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedRankRecord = await this.repo.save(rankRecord, {
        reload: true, // Tự động load lại entity sau khi lưu để có đầy đủ dữ liệu
        transaction: false, // Tắt transaction để tăng tốc độ
        chunk: 100, // Chia nhỏ nếu có nhiều dữ liệu
        data: { ordered: true }, // Dữ liệu có thứ tự
        listeners: true, // Kích hoạt các listener nếu có
      });
      return savedRankRecord;
    } catch (error) {
      this.logger.error({
        message: `🔴 create rank record`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // CREATE MANY
  // =================================================================
  async createMany(
    data: Partial<RankRecord>[],
    options?: SaveOptions,
  ): Promise<{ ids: string[]; count: number; data: RankRecord[] }> {
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
        message: `🔴 create many rank records`,
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
    data: Partial<RankRecord>,
    options?: SaveOptions,
  ): Promise<RankRecord | null> {
    try {
      const rankRecord = await this.repo.findOneBy({ _id: new ObjectId(_id) });
      if (!rankRecord) return null;

      // Helper: Loại bỏ undefined keys
      const cleanData = this._cleanPayload(data);

      // Merge dữ liệu mới vào entity cũ
      this.repo.merge(rankRecord, cleanData);
      rankRecord.updatedAt = new Date();

      const updatedRankRecord = await this.repo.save(rankRecord, {
        ...options,
      });
      return updatedRankRecord;
    } catch (error) {
      this.logger.error({
        message: `🔴 update rank record`,
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
    data: Partial<RankRecord>,
    options?: UpdateOptions,
  ): Promise<{ modifiedCount: number; matchedCount: number }> {
    try {
      const objectIds = ids.map((id) => new ObjectId(id));

      const cleanData = this._cleanPayload(data);

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
        message: `🔴 update many rank records`,
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
        message: `🔴 delete rank record`,
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
        message: `🔴 delete many rank records`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // FIND BY ID
  // =================================================================
  async findById(queryDto: input.findById): Promise<RankRecord | null> {
    try {
      const projection = queryDto.select?.length
        ? (queryDto.select as (keyof RankRecord)[])
        : undefined;

      const rankRecord = await this.repo.findOne({
        where: { _id: new ObjectId(queryDto._id) },
        select: projection,
      });
      return rankRecord;
    } catch (error) {
      this.logger.error({
        message: `🔴 find by id rank record`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // FIND ALL
  // =================================================================
  async findAll(queryDto: input.findAll): Promise<{
    data: RankRecord[];
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
        ? (select as (keyof RankRecord)[])
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
        message: `🔴 find all rank records`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // HELPER (Làm sạch payload để loại bỏ các trường undefined hoặc null)
  // =================================================================
  private _cleanPayload(data: any): any {
    const cleaned = { ...data };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === undefined || cleaned[key] === null) {
        delete cleaned[key];
      }
    });
    return cleaned;
  }

  // =================================================================
  // HELPER: Tính toán lastUptime mới nhất
  // =================================================================
  private _getLatestUptime(
    existingUptime: Date | undefined,
    newUptime: Date | undefined,
  ): Date | undefined {
    if (!newUptime) return existingUptime;
    if (!existingUptime) return newUptime;
    return new Date(newUptime) > new Date(existingUptime)
      ? newUptime
      : existingUptime;
  }

  // =================================================================
  // HELPER: Lấy thời gian hiện tại theo GMT+7 (Việt Nam)
  // =================================================================
  private _getVietnamTime(): Date {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 7 * 3600000); // GMT+7
  }

  // =================================================================
  // FIND MANY BY IDS (Sử dụng cho DataLoader)
  // =================================================================
  async findManyByIds(data: {
    ids: string[];
    select?: string[];
  }): Promise<RankRecord[]> {
    try {
      const rankRecords = await this.repo.find({
        where: {
          _id: { $in: data.ids.map((id) => new ObjectId(id)) },
        },
        select: data?.select?.length ? data.select : undefined,
      });
      return rankRecords;
    } catch (error) {
      this.logger.error({
        message: `🔴 find many by ids rank record`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // UPSERT LEADERBOARD ENTRY (thêm/cập nhật một entry vào leaderboard)
  // =================================================================
  async upsertLeaderboardEntry(data: {
    month: number;
    year: number;
    entry: {
      userId: string;
      totalXP?: number;
      totalUptime?: number;
      lastUptime?: Date;
      milestonesTotalUptime?: TotalUptimeStatus_Leaderboard_RankRecord[];
    };
  }): Promise<RankRecord> {
    try {
      const { month, year, entry } = data;

      // Tìm RankRecord theo month + year
      let rankRecord = await this.repo.findOne({
        where: { month, year },
      });
      //console.log('Found RankRecord for upsertLeaderboardEntry: ', rankRecord);
      if (!rankRecord) {
        // Tạo mới nếu chưa có
        rankRecord = this.repo.create({
          month,
          year,
          leaderboard: [
            {
              userId: entry.userId,
              totalXP: entry.totalXP ?? 0,
              totalUptime: entry.totalUptime ?? 0,
              lastUptime: entry.lastUptime ?? new Date(),
              milestonesTotalUptime: TOTAL_UPTIME_STATUS,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        // Cập nhật leaderboard cho user
        const existingIndex = rankRecord.leaderboard?.findIndex(
          (e) => e.userId === entry.userId,
        );

        //Tìm thấy index của user trong leaderboard
        if (existingIndex !== undefined && existingIndex >= 0) {
          // Cập nhật entry hiện có
          const leaderboardUser = rankRecord?.leaderboard?.[existingIndex];

          const oldExistingXP = leaderboardUser?.totalXP ?? 0;
          const oldTotalUptime = leaderboardUser?.totalUptime ?? 0;

          rankRecord.leaderboard![existingIndex] = {
            ...leaderboardUser,
            milestonesTotalUptime:
              leaderboardUser?.milestonesTotalUptime ?? TOTAL_UPTIME_STATUS, // bắt buộc phải lấy cái cũ
            userId: leaderboardUser?.userId,
            totalXP: oldExistingXP + (entry.totalXP ?? 0),
            totalUptime: oldTotalUptime + (entry.totalUptime ?? 0),
            lastUptime: this._getLatestUptime(
              leaderboardUser?.lastUptime,
              entry.lastUptime,
            ),
          };
          this._publishEventTotalUptimeChange({
            month,
            year,
            userId: entry.userId,
            totalUptime: oldTotalUptime + (entry.totalUptime ?? 0),
            milestonesTotalUptime:
              leaderboardUser?.milestonesTotalUptime ?? TOTAL_UPTIME_STATUS,
          });
        } else {
          // Không tìm thấy index của user trong leaderboard
          // Thêm entry mới
          const newEntry: LeaderboardRankRecord = {
            userId: entry.userId,
            totalXP: entry.totalXP || 0,
            totalUptime: entry.totalUptime || 0,
            lastUptime: entry.lastUptime || new Date(),
            milestonesTotalUptime: TOTAL_UPTIME_STATUS,
          };
          rankRecord.leaderboard = [
            ...(rankRecord.leaderboard ?? []),
            newEntry,
          ];
          // Bắn event milestone cho entry mới với existingTotalUptime = 0
          this._publishEventTotalUptimeChange({
            month,
            year,
            userId: entry.userId,
            totalUptime: newEntry.totalUptime!,
            milestonesTotalUptime: TOTAL_UPTIME_STATUS,
          });
        }
      }

      rankRecord.updatedAt = new Date();

      const savedRankRecord = await this.repo.save(rankRecord);
      return savedRankRecord;
    } catch (error) {
      this.logger.error({
        message: `🔴 upsertLeaderboardEntry`,
        trace: error,
      });
      throw error;
    }
  }

  // =================================================================
  // PUBLISH EVENT: Publish event khi có totalUptime thay đổi
  // =================================================================
  private _publishEventTotalUptimeChange(data: {
    month: number;
    year: number;
    userId: string;
    totalUptime: number;
    milestonesTotalUptime: TotalUptimeStatus_Leaderboard_RankRecord[];
  }): void {
    try {
      //console.log('🎧 _publishEventTotalUptimeChange', data);
      //các cột mốc time (50h,100h,200h,500h,1000h)
      //chỉ bắn event khi đạt được cột mốc cao nhất cuối cùng mà trước đó chưa từng đạt

      // Lọc ra các cột mốc mà newTotalUptime đạt được nhưng existingTotalUptime chưa đạt
      const newMilestonesReached = data.milestonesTotalUptime.filter(
        (column) =>
          column.status === TotalUptimeStatusEnum.NOT_COMPLETED &&
          data.totalUptime >= column.milestone * 60 * 60 &&
          data.totalUptime < (column.milestone + 1) * 60 * 60,
      );
      //console.log('🎧 newMilestonesReached', newMilestonesReached);

      // Đảm bảo không cấp chứng chỉ nhiều lần

      // Chỉ bắn event nếu có cột mốc mới đạt được, lấy cột mốc cao nhất
      if (newMilestonesReached.length > 0) {
        const highestMilestone =
          newMilestonesReached[newMilestonesReached.length - 1];

        const results = this.eventEmitter.emit(
          RankRecordEvent.milestoneReached.name,
          new RankRecordEvent.milestoneReached.payload({
            month: data.month,
            year: data.year,
            userId: data.userId,
            totalUptime: data.totalUptime,
            milestone: highestMilestone.milestone,
          }),
        );
        this.logger.log(`🔔 Người dùng ${data.userId} đã đạt được cột mốc mới ${highestMilestone.milestone}h`);

        this.updateOneMilestonesTotalUptime({
          month: data.month,
          year: data.year,
          userId: data.userId,
          milestone: highestMilestone.milestone,
          newStatus: TotalUptimeStatusEnum.PENDING,
        });

        if (!results) {
          this.logger.error({
            message: `⚠️ ${RankRecordEvent.milestoneReached.name} not delivered`,
          });
        }
      } else {
        this.logger.log(
          `🔔 Người dùng ${data.userId} không đạt được cột mốc mới`,
        );
      }
    } catch (error) {
      this.logger.error({
        message: `🔴 _publishEventTotalUptimeChange`,
        trace: error,
      });
      throw error;
    }
  }

  async updateOneMilestonesTotalUptime(data: {
    month: number;
    year: number;
    userId: string;
    milestone: number;
    newStatus: TotalUptimeStatusEnum
  }): Promise<TotalUptimeStatus_Leaderboard_RankRecord[] | undefined> {
    try {
      let rankRecord = await this.repo.findOne({
        where: { month: data.month, year: data.year },
      });
      // Không tìm thấy RankRecord
      if (!rankRecord) {
        return undefined;
      }
      const existingUserIndex = rankRecord.leaderboard?.findIndex(
        (e) => e?.userId === data?.userId,
      );
      //Không tìm thấy index của user trong leaderboard
      if (existingUserIndex === undefined || existingUserIndex < 0) {
        return undefined;
      }

      //không tìm thấy user trong leaderboard
      if (!rankRecord?.leaderboard?.[existingUserIndex]) {
        return undefined;
      }

      rankRecord.leaderboard[existingUserIndex].milestonesTotalUptime =
        rankRecord.leaderboard[existingUserIndex].milestonesTotalUptime.map(
          (column) => {
            if (column.milestone === data.milestone) {
              return {
                ...column,
                status: data.newStatus,
              };
            }
            return column;
          },
        );

      const savedRankRecord = await this.repo.save(rankRecord);

      return savedRankRecord?.leaderboard?.[existingUserIndex]
        ?.milestonesTotalUptime;
    } catch (error) {
      this.logger.error({
        message: `🔴 updateOneMilestonesTotalUptime`,
        trace: error,
      });
      throw error;
    }
  }
}
