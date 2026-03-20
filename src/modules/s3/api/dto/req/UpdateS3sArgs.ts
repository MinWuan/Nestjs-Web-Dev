import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateS3Args } from './UpdateS3Args';

@InputType()
class UpdateS3Data extends OmitType(UpdateS3Args, ['_id'] as const) {}

@InputType()
export class UpdateS3sArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids: string[];

  @Field(() => UpdateS3Data)
  @ValidateNested()
  @Type(() => UpdateS3Data)
  data: UpdateS3Data;
}
