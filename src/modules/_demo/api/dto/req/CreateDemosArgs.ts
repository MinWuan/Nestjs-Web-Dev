import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDemoArgs } from './CreateDemoArgs';

@InputType()
export class CreateDemosArgs {
  @Field(() => [CreateDemoArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDemoArgs)
  demos!: CreateDemoArgs[];
}
