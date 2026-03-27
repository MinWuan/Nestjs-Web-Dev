import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class LoginArgs {
  @Field(() => String)
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @Field(() => String)
  @IsString()
  @MinLength(6)
  password!: string;
}
