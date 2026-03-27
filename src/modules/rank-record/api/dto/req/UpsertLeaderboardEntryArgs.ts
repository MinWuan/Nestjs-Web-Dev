import { InputType, Field, Int } from '@nestjs/graphql';
import { ValidateNested,IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { LeaderboardRankRecordInput } from '../../../entity';

@InputType()
export class UpsertLeaderboardEntryArgs {
  @Field(() => Int)
  @IsNumber()
  month!: number;

  @Field(() => Int)
  @IsNumber()
  year!: number;

  @Field(() => LeaderboardRankRecordInput)
  @ValidateNested()
  @Type(() => LeaderboardRankRecordInput)
  entry!: LeaderboardRankRecordInput;
}
