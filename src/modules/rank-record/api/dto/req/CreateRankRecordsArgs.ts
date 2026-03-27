import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRankRecordArgs } from './CreateRankRecordArgs';

@InputType()
export class CreateRankRecordsArgs {
  @Field(() => [CreateRankRecordArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateRankRecordArgs)
  rankRecords!: CreateRankRecordArgs[];
}
