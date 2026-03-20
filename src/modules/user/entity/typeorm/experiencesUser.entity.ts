import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationExperiencesUser, LocationExperiencesUserInput } from './locationExperiencesUser.entity';

@ObjectType()
export class ExperiencesUser {
  @Column()
  @Field(() => String, { nullable: true })
  title?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  company?: string;

  @Column(() => LocationExperiencesUser)
  @Field(() => LocationExperiencesUser, { nullable: true })
  location?: LocationExperiencesUser;

  @Column()
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  endDate?: Date;

  @Column()
  @Field(() => Boolean, { nullable: true })
  isCurrent?: boolean;
}

@InputType()
export class ExperiencesUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company?: string;

  @Field(() => LocationExperiencesUserInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationExperiencesUserInput)
  location?: LocationExperiencesUserInput;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;
}
