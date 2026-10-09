import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class GetLeaderboardArgs {
  // @Field(() => String)
  // @IsString()
  // userId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  month?: number;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;
}
