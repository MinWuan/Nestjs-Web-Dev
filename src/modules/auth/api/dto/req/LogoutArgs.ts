import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class LogoutArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
