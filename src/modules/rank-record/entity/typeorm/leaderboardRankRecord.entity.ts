import { Column } from 'typeorm';
import { ObjectType, Field, InputType, Float, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TotalUptimeStatus_Leaderboard_RankRecord,
  TotalUptimeStatus_Leaderboard_RankRecordInput
 } from './totalUptimeStatus';

// ObjectType
@ObjectType()
export class LeaderboardRankRecord {
  @Column()
  @Field(() => String, { nullable: true })
  userId?: string;

  @Column()
  @Field(() => Float, { nullable: true })
  totalXP?: number;

  @Column()
  @Field(() => Float, { nullable: true })
  totalUptime?: number;

  @Column()
  @Field(() => TotalUptimeStatus_Leaderboard_RankRecord, { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => TotalUptimeStatus_Leaderboard_RankRecord)
  milestonesTotalUptime!: TotalUptimeStatus_Leaderboard_RankRecord[];

  @Column()
  @Field(() => Date, { nullable: true })
  lastUptime?: Date;
}

// InputType
@InputType()
export class LeaderboardRankRecordInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  totalXP?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  totalUptime?: number;

  @Field(() => TotalUptimeStatus_Leaderboard_RankRecordInput, { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TotalUptimeStatus_Leaderboard_RankRecordInput)
  milestonesTotalUptime!: TotalUptimeStatus_Leaderboard_RankRecordInput[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUptime?: Date;
}
