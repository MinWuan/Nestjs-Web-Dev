import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { ObjectId } from 'mongodb';

// ---------------------------------------------------------------
// Enum
// ---------------------------------------------------------------
export enum RoleEnum {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
  DEV = 'DEV',
}

registerEnumType(RoleEnum, { name: 'RoleEnum' });

// ---------------------------------------------------------------
// ObjectType
// ---------------------------------------------------------------
@Index(['role'], { unique: true })
@Entity('roles')
@ObjectType()
export class Role {
  @ObjectIdColumn()
  @Field(() => ID)
  _id!: ObjectId;

  @Column()
  @Field(() => RoleEnum, { nullable: true })
  role?: RoleEnum;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  description?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

// ---------------------------------------------------------------
// InputType
// ---------------------------------------------------------------
@InputType()
export class RoleInput {
  @Field(() => RoleEnum)
  @IsEnum(RoleEnum)
  @IsNotEmpty()
  role!: RoleEnum;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
