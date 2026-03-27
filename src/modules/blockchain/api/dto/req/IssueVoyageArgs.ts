import {
  InputType,
  Field,
  Int,
} from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class IssueVoyageArgs {
  @Field(() => String)
  @IsString()
  learnerAddress!: string;

  @Field(() => String)
  @IsString()
  @Transform(({ value }) => value?.trim())
  learnerName!: string;

  @Field(() => String)
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  learnerEmail!: string;

  @Field(() => String)
  @IsString()
  @MaxLength(200)
  @Transform(({ value }) => value?.trim())
  courseName!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
