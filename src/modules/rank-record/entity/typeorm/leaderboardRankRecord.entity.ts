import { Column, ObjectIdColumn } from 'typeorm';
import { ObjectType, Field, InputType, Float, Int, ID } from '@nestjs/graphql';
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
import {
  TotalUptimeStatus_Leaderboard_RankRecord,
  TotalUptimeStatus_Leaderboard_RankRecordInput,
} from './totalUptimeStatus';
import { ObjectId } from 'mongodb';

// ObjectType
@ObjectType()
export class LeaderboardRankRecord {
  @ObjectIdColumn({ nullable: true })
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Column()
  @Field(() => ID, { nullable: true })
  userId?: ObjectId;

  @Column()
  @Field(() => Float, { nullable: true })
  totalXP?: number;

  @Column()
  @Field(() => Float, { nullable: true })
  totalUptime?: number;

  @Column()
  @Field(() => [TotalUptimeStatus_Leaderboard_RankRecord], {
    nullable: 'itemsAndList',
  })
  @ValidateNested({ each: true }) // validate nested array
  @Type(() => TotalUptimeStatus_Leaderboard_RankRecord)
  milestonesTotalUptime?: TotalUptimeStatus_Leaderboard_RankRecord[];

  @Column()
  @Field(() => Date, { nullable: true })
  lastUptime?: Date;
}

// InputType
@InputType()
export class LeaderboardRankRecordInput {
  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  userId?: ObjectId;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  totalXP?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  totalUptime?: number;

  @Field(() => [TotalUptimeStatus_Leaderboard_RankRecordInput], {
    nullable: 'itemsAndList',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // validate nested array
  @Type(() => TotalUptimeStatus_Leaderboard_RankRecordInput)
  milestonesTotalUptime?: TotalUptimeStatus_Leaderboard_RankRecordInput[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUptime?: Date;
}
