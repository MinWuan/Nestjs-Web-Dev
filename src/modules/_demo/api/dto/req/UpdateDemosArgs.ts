import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateDemoArgs } from './UpdateDemoArgs';

@InputType()
class UpdateDemoData extends OmitType(UpdateDemoArgs, ['_id'] as const) {}

@InputType()
export class UpdateDemosArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids: string[];

  @Field(() => UpdateDemoData)
  @ValidateNested()
  @Type(() => UpdateDemoData)
  data: UpdateDemoData;
}
