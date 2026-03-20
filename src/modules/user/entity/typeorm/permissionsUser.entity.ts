import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, IsIn } from 'class-validator';

@ObjectType()
export class PermissionsUser {
  @Column()
  @Field(() => String, { nullable: true })
  name?: string;

  @Column()
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => String, { nullable: true })
  limit?: string;
}

@InputType()
export class PermissionsUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsIn(['UPLOAD_FILE'])
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  limit?: string;
}
