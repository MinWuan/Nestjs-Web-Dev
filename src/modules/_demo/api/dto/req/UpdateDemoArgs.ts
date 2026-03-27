import { InputType, Field, PartialType } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

import { CreateDemoArgs } from './CreateDemoArgs';

@InputType()
export class UpdateDemoArgs extends PartialType(CreateDemoArgs) {
  @Field(() => String)
  _id!: string;
  //Partial type nên tất cả các field đều là optional

  // @Field() // bắt buộc lại không optional ghi đè
  // field: string;
}
