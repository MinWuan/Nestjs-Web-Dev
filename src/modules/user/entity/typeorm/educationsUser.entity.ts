import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationEducationsUser, LocationEducationsUserInput } from './locationEducationsUser.entity';

@ObjectType()
export class EducationsUser {
  @Column()
  @Field(() => String, { nullable: true })
  degree?: string;

  @Column()
  @Field(() => String, { nullable: true })
  fieldOfStudy?: string;

  @Column()
  @Field(() => String, { nullable: true })
  school?: string;

  @Column(() => LocationEducationsUser)
  @Field(() => LocationEducationsUser, { nullable: true })
  location?: LocationEducationsUser;

  @Column()
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  endDate?: Date;
}

@InputType()
export class EducationsUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  degree?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  school?: string;

  @Field(() => LocationEducationsUserInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationEducationsUserInput)
  location?: LocationEducationsUserInput;

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
}
