import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  Index,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsEmpty,
  Length,
  MinLength,
  MaxLength,
  IsEmail,
  IsUrl,
  IsUUID,
  Matches,
  IsPhoneNumber,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsPositive,
  IsNegative,
  IsBoolean,
  IsOptional,
  IsDefined,
  IsEnum,
  IsIn,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsObject,
  IsDate,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

//ObjectType ----------------------------------------------------------------

@Entity('roleTests')
@ObjectType()
export class RoleTest {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;

  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  description: string;

  @Column() 
  @Field(() => [String], { nullable: true })
  permissions: string[];

  @Column()
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;

  @Column()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
//InputType ----------------------------------------------------------------

@InputType()
export class RoleTestInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Index({ unique: true })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  permissions: string[];

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

//Partial ---------------------------------------------------------------
