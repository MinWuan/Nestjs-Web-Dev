import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  InputType,
  Int,
  Float,
} from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsDate,
  ValidateNested,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

import { LeaderboardRankRecord, LeaderboardRankRecordInput } from './leaderboardRankRecord.entity';

// ---------------------------------------------------------------
// ObjectType
// ---------------------------------------------------------------

@Index(['month', 'year'], { unique: true })
@Entity('rankrecords')
@ObjectType()
export class RankRecord {
  @ObjectIdColumn()
  @Field(() => ID)
  _id!: ObjectId;

  @Column()
  @Field(() => Int, { nullable: true })
  month?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  year?: number;

  @Column({ type: 'array' })
  @Field(() => [LeaderboardRankRecord], { nullable: 'itemsAndList' })
  leaderboard?: LeaderboardRankRecord[];

  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

// ---------------------------------------------------------------
// InputType
// ---------------------------------------------------------------

@InputType()
export class RankRecordInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  month!: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  year!: number;

  @Field(() => [LeaderboardRankRecordInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LeaderboardRankRecordInput)
  leaderboard?: LeaderboardRankRecordInput[];
}
