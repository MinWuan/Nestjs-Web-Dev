import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@ObjectType()
export class LocationUser {
  @Column()
  @Field(() => String, { nullable: true })
  country?: string;

  @Column()
  @Field(() => String, { nullable: true })
  city?: string;

  @Column()
  @Field(() => String, { nullable: true })
  ward?: string;

  @Column()
  @Field(() => String, { nullable: true })
  address?: string;
}

@InputType()
export class LocationUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ward?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
}
