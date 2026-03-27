import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSessionArgs } from './CreateSessionArgs';

@InputType()
export class CreateSessionsArgs {
  @Field(() => [CreateSessionArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSessionArgs)
  sessions!: CreateSessionArgs[];
}
