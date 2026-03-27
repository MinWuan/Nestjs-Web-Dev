import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateRankRecordArgs } from './UpdateRankRecordArgs';

@InputType()
class UpdateRankRecordData extends OmitType(UpdateRankRecordArgs, ['_id'] as const) {}

@InputType()
export class UpdateRankRecordsArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids!: string[];

  @Field(() => UpdateRankRecordData)
  @ValidateNested()
  @Type(() => UpdateRankRecordData)
  data!: UpdateRankRecordData;
}
