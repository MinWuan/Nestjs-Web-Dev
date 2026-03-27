/**
 * dolphintutor-achievement.controller.ts
 * REST API — cấp chứng nhận thành tích Dolphintutor
 *
 * POST /achievements/grind
 * POST /achievements/unbroken
 * POST /achievements/voyage
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  IsString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsEthereumAddress,
  Min,
  MaxLength,
  IsDateString,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  AchievementService,
  AchievementIssuedResult,
  PeriodType,
} from './achievement.service';
import { AppLogger } from '@/common/logger/app.logger';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export class IssueGrindDto {
  @IsEthereumAddress({
    message: 'learnerAddress phải là địa chỉ ví Ethereum hợp lệ',
  })
  learnerAddress!: string;

  @IsString()
  @MaxLength(100, { message: 'learnerName tối đa 100 ký tự' })
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @IsEmail({}, { message: 'learnerEmail không hợp lệ' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @IsEnum(PeriodType, {
    message: 'periodType phải là 0=DAILY 1=WEEKLY 2=MONTHLY 3=CUSTOM',
  })
  @Type(() => Number)// để đảm bảo giá trị được chuyển thành number trước khi validate enum
  periodType!: PeriodType;

  @IsString()
  @MaxLength(50, { message: 'periodLabel tối đa 50 ký tự' })
  @Transform(({ value }) => value?.trim())
  periodLabel!: string; // VD: "Tháng 03/2026"

  @IsInt({ message: 'studyHours phải là số nguyên' })
  @Min(1, { message: 'studyHours phải >= 1' })
  @Type(() => Number)
  studyHours!: number;

  @IsOptional()
  @IsInt({ message: 'rank phải là số nguyên' })
  @Min(0, { message: 'rank phải >= 0 (0 = không có rank)' })
  @Type(() => Number)
  rank?: number;
}

export class IssueUnbrokenDto {
  @IsEthereumAddress({
    message: 'learnerAddress phải là địa chỉ ví Ethereum hợp lệ',
  })
  learnerAddress!: string;

  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @IsEmail({}, { message: 'learnerEmail không hợp lệ' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @IsDateString({}, { message: 'startDate phải là ISO 8601, VD: 2026-03-01' })
  startDate!: string; // ISO 8601: "2026-03-01"

  @IsDateString({}, { message: 'endDate phải là ISO 8601, VD: 2026-03-30' })
  endDate!: string;

  @IsInt({ message: 'streakDays phải là số nguyên' })
  @Min(1, { message: 'streakDays phải >= 1' })
  @Type(() => Number)
  streakDays!: number;
}

export class IssueVoyageDto {
  @IsEthereumAddress({
    message: 'learnerAddress phải là địa chỉ ví Ethereum hợp lệ',
  })
  learnerAddress!: string;

  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @IsEmail({}, { message: 'learnerEmail không hợp lệ' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @IsString()
  @MaxLength(200, { message: 'courseName tối đa 200 ký tự' })
  @Transform(({ value }) => value?.trim())
  courseName!: string;

  @IsOptional()
  @IsDateString({}, { message: 'completedAt phải là ISO 8601' })
  completedAt?: string; // optional — default: now
}

// ─── Response wrapper ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta: {
    timestamp: string;
    durationMs: number;
  };
}

// ─── Controller ───────────────────────────────────────────────────────────────

@Controller('achievements')
export class DolphintutorAchievementController {
  constructor(
    private readonly achievementService: AchievementService,
    private readonly logger: AppLogger,
  ) {}

  // ─── POST /achievements/grind ───────────────────────────────────────────────

  /**
   * Cấp chứng nhận "The Grind" — nỗ lực giờ học
   *
   * @example
   * POST /achievements/grind
   * {
   *   "learnerAddress": "0x3ede57807E4918bd4ca08B26C88A7aB1d8aE6247",
   *   "learnerName":    "Nguyen Minh Quan",
   *   "learnerEmail":   "quantk4268@gmail.com",
   *   "periodType":     2,
   *   "periodLabel":    "Tháng 03/2026",
   *   "studyHours":     100,
   *   "rank":           1
   * }
   */
  @Post('grind')
  @HttpCode(HttpStatus.CREATED)
  async issueGrind(
    @Body() dto: IssueGrindDto,
  ): Promise<ApiResponse<AchievementIssuedResult>> {
    const start = Date.now();
    this.logger.log(
      `→ POST /achievements/grind | learner=${dto.learnerAddress} | ${dto.studyHours}h | ${dto.periodLabel}`,
    );

    try {
      const data = await this.achievementService.issueGrind({
        learnerAddress: dto.learnerAddress,
        learnerName: dto.learnerName,
        learnerEmail: dto.learnerEmail,
        periodType: dto.periodType,
        periodLabel: dto.periodLabel,
        studyHours: dto.studyHours,
        rank: dto.rank ?? 0,
      });

      this.logger.log(
        `← 201 grind OK | tokenId=${data.tokenId} | certId=${data.certId} | ${Date.now() - start}ms`,
      );

      return this._ok(data, start);
    } catch (err) {
      return this._handleError(err, 'issueGrind', start);
    }
  }

  // ─── POST /achievements/unbroken ────────────────────────────────────────────

  /**
   * Cấp chứng nhận "Unbroken" — chuỗi học liên tiếp
   *
   * @example
   * POST /achievements/unbroken
   * {
   *   "learnerAddress": "0x3ede57807E4918bd4ca08B26C88A7aB1d8aE6247",
   *   "learnerName":    "Nguyen Minh Quan",
   *   "learnerEmail":   "quantk4268@gmail.com",
   *   "startDate":      "2026-03-01",
   *   "endDate":        "2026-03-30",
   *   "streakDays":     30
   * }
   */
  @Post('unbroken')
  @HttpCode(HttpStatus.CREATED)
  async issueUnbroken(
    @Body() dto: IssueUnbrokenDto,
  ): Promise<ApiResponse<AchievementIssuedResult>> {
    const start = Date.now();

    // Validate date range trước khi gọi blockchain
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('endDate phải >= startDate');
    }

    this.logger.log(
      `→ POST /achievements/unbroken | learner=${dto.learnerAddress} | ${dto.streakDays} days`,
    );

    try {
      const data = await this.achievementService.issueUnbroken({
        learnerAddress: dto.learnerAddress,
        learnerName: dto.learnerName,
        learnerEmail: dto.learnerEmail,
        startDate,
        endDate,
        streakDays: dto.streakDays,
      });

      this.logger.log(
        `← 201 unbroken OK | tokenId=${data.tokenId} | certId=${data.certId} | ${Date.now() - start}ms`,
      );

      return this._ok(data, start);
    } catch (err) {
      return this._handleError(err, 'issueUnbroken', start);
    }
  }

  // ─── POST /achievements/voyage ──────────────────────────────────────────────

  /**
   * Cấp chứng nhận "Voyage Complete" — hoàn thành khoá học
   *
   * @example
   * POST /achievements/voyage
   * {
   *   "learnerAddress": "0x3ede57807E4918bd4ca08B26C88A7aB1d8aE6247",
   *   "learnerName":    "Nguyen Minh Quan",
   *   "learnerEmail":   "quantk4268@gmail.com",
   *   "courseName":     "IELTS Preparation",
   *   "completedAt":    "2026-03-20"
   * }
   */
  @Post('voyage')
  @HttpCode(HttpStatus.CREATED)
  async issueVoyage(
    @Body() dto: IssueVoyageDto,
  ): Promise<ApiResponse<AchievementIssuedResult>> {
    const start = Date.now();
    this.logger.log(
      `→ POST /achievements/voyage | learner=${dto.learnerAddress} | course="${dto.courseName}"`,
    );

    try {
      const data = await this.achievementService.issueVoyage({
        learnerAddress: dto.learnerAddress,
        learnerName: dto.learnerName,
        learnerEmail: dto.learnerEmail,
        courseName: dto.courseName,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      });

      this.logger.log(
        `← 201 voyage OK | tokenId=${data.tokenId} | certId=${data.certId} | ${Date.now() - start}ms`,
      );

      return this._ok(data, start);
    } catch (err) {
      return this._handleError(err, 'issueVoyage', start);
    }
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private _ok<T>(data: T, start: number): ApiResponse<T> {
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        durationMs: Date.now() - start,
      },
    };
  }

  private _handleError(err: unknown, method: string, start: number): never {
    const message = err instanceof Error ? err.message : String(err);

    this.logger.error({
      message: `Error in ${method}: ${message}`,
      trace: err instanceof Error ? err.stack : String(err),
    });

    // Custom errors từ contract → 400
    const contractErrors: Record<string, string> = {
      NotAuthorized: 'Issuer không có quyền cấp chứng nhận',
      ZeroAddress: 'Địa chỉ học viên không hợp lệ',
      EmptyName: 'Tên học viên không được để trống',
      EmptyCourseName: 'Tên khoá học không được để trống',
      ZeroStudyHours: 'Số giờ học phải > 0',
      ZeroStreakDays: 'Số ngày streak phải > 0',
      InvalidDateRange: 'endDate phải >= startDate',
      BatchTooLarge: 'Batch vượt quá giới hạn 50',
    };

    for (const [errName, friendlyMsg] of Object.entries(contractErrors)) {
      if (message.includes(errName)) {
        throw new BadRequestException(friendlyMsg);
      }
    }

    // Lỗi network / timeout → 500
    throw new InternalServerErrorException(
      `Blockchain transaction failed: ${message}`,
    );
  }
}
