import { InputType, Field, PartialType } from '@nestjs/graphql';
import {} from 'class-validator';
import {} from 'class-transformer';

import { CreateS3Args } from './CreateS3Args';

@InputType()
export class UpdateS3Args extends PartialType(CreateS3Args) {
  @Field(() => String)
  _id!: string;
  //Partial type nên tất cả các field đều là optional

  // @Field() // bắt buộc lại không optional ghi đè
  // field: string;
}
