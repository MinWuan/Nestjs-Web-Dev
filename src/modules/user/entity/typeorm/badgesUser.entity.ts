import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

@ObjectType()
export class BadgesUser {
  @Column()
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  iconUrl?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  awardedAt?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  expiresAt?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  awardedBy?: string;
}

@InputType()
export class BadgesUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['recognition', 'status', 'system', 'custom'])
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  iconUrl?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  awardedAt?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  awardedBy?: string;
}
