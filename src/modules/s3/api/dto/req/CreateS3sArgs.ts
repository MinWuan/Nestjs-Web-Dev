import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateS3Args } from './CreateS3Args';

@InputType()
export class CreateS3sArgs {
  @Field(() => [CreateS3Args])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateS3Args)
  s3s: CreateS3Args[];
}
