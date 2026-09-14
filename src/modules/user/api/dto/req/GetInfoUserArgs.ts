import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';
import {} from 'class-transformer';

@InputType()
export class GetInfoUserArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
