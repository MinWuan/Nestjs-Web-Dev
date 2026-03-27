import { Column } from 'typeorm';
import { ObjectType, Field, InputType, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TotalUptimeStatusEnum } from '@/common/enums';

export { TotalUptimeStatusEnum };

export const TOTAL_UPTIME_STATUS = [
    {
        milestone: 50,
        status: TotalUptimeStatusEnum.NOT_COMPLETED,
        completedAt: undefined,
    },
    {
        milestone: 100,
        status: TotalUptimeStatusEnum.NOT_COMPLETED,
        completedAt: undefined,
    },
    {
        milestone: 200,
        status: TotalUptimeStatusEnum.NOT_COMPLETED,
        completedAt: undefined,
    },
    {
        milestone: 500,
        status: TotalUptimeStatusEnum.NOT_COMPLETED,
        completedAt: undefined,
    },
    {
        milestone: 1000,
        status: TotalUptimeStatusEnum.NOT_COMPLETED,
        completedAt: undefined,
    },
]

// ObjectType
@ObjectType()
export class TotalUptimeStatus_Leaderboard_RankRecord {
  @Column()
  @Field(() => Int, { nullable: true })
  milestone!: number;

  @Column()
  @Field(() => String, { nullable: true })
  status!:
    | TotalUptimeStatusEnum.PENDING
    | TotalUptimeStatusEnum.COMPLETED
    | TotalUptimeStatusEnum.NOT_COMPLETED;

  @Column()
  @Field(() => Date, { nullable: true })
  completedAt?: Date;
}

// InputType
@InputType()
export class TotalUptimeStatus_Leaderboard_RankRecordInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  milestone!: number;

  @Field(() => String)
  @IsIn(Object.values(TotalUptimeStatusEnum))
  @IsNotEmpty()
  status!:
    | TotalUptimeStatusEnum.PENDING
    | TotalUptimeStatusEnum.COMPLETED
    | TotalUptimeStatusEnum.NOT_COMPLETED;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;
}
