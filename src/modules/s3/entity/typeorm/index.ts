import { Entity, ObjectIdColumn, Column, ObjectId, Index } from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { User } from '@/modules/user';

// ---------------------------------------------------------------
// ObjectType
// ---------------------------------------------------------------
@Index(['authorId'])
@Entity('s3')
@ObjectType()
export class S3 {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;

  @Column()
  @Field({ nullable: true })
  key?: string;

  @Column()
  @Field({ nullable: true })
  url?: string;

  @Column()
  @Field({ nullable: true })
  mimetype?: string;

  @Column({ default: '' })
  @Field({ nullable: true })
  originalname?: string;

  @Column({ default: 0 })
  @Field({ nullable: true })
  size?: number;

  @Column()
  @Field({ nullable: true })
  bucket?: string;

  @Column()
  @Field(() => ID, { nullable: true })
  authorId?: ObjectId;

  @Column()
  @Field({ nullable: true })
  createdAt?: Date;

  @Column()
  @Field({ nullable: true })
  updatedAt?: Date;
}

// ---------------------------------------------------------------
// InputType
// ---------------------------------------------------------------
@InputType()
export class S3Input {
  @Field()
  @IsString()
  @IsNotEmpty()
  key: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  url: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  originalname?: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  size?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  bucket: string;

  @Field(() => ID)
  @IsMongoId()
  @IsNotEmpty()
  authorId: ObjectId;
}
