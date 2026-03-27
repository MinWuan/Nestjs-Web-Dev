import {
  Entity,
  ObjectIdColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsMongoId,
  IsEmail,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { User } from '@/modules/user';

// @Index(['session_id'], { unique: true })
// @Index(['id_user'])
@Entity('sessions')
@ObjectType()
export class Session {
  @ObjectIdColumn()
  @Field(() => ID)
  _id!: ObjectId;

  @Column()
  @Field(() => ID, { nullable: true })
  id_user?: ObjectId;

  @Field(() => User, { nullable: true })
  user?: User;

  @Column()
  @Field(() => String, { nullable: true })
  email?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  ip?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  city?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  region?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  country?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  location?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  timezone?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  user_agent?: string;

  @Column({ default: '' })
  @Field(() => String, { nullable: true })
  device?: string;

  @Column({ type: 'date' })
  @Field(() => Date, { nullable: true })
  expired_at?: Date;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class SessionInput {
  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  id_user!: ObjectId;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ip?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  timezone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  user_agent?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  device?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  expired_at?: Date;
}
