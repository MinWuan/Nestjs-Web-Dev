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
import {
  RoleTest
} from '@/modules/_role-test/entity';

enum DemoSettingsRoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

registerEnumType(DemoSettingsRoleEnum, { name: 'DemoSettingsRoleEnum' });

//ObjectType ----------------------------------------------------------------

@ObjectType()
export class DemoSettings {
  @Column()
  @Field(() => Boolean, { nullable: true })
  isVerified: boolean;

  @Column()
  @Field(() => DemoSettingsRoleEnum, { nullable: true })
  role: DemoSettingsRoleEnum;
}

@ObjectType()
export class DemoUserInfo {
  @Column()
  @Field(() => String, { nullable: true })
  name: string;

  @Column()
  @Field(() => String, { nullable: true })
  roleId: string;

  @Field(() => RoleTest, { nullable: true })
  @IsOptional()
  role?: RoleTest;
}

@Index(['fullName', 'email', 'phone'])
@Index(['createdAt'])
@Index(['updatedAt'])
@Index(['email'], { unique: true })
@Entity('demos')
@ObjectType()
export class Demo {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;

  @Column()
  @Field(() => String, { nullable: true })
  fullName: string;

  @Column()
  @Field(() => Number, { nullable: true })
  age: number;

  @Column({ type: 'text' })
  @Field(() => String, { nullable: true })
  address: string

  @Column()
  @Field(() => String, { nullable: true })
  email: string;

  @Column()
  @Field(() => String, { nullable: true })
  phone: string;

  @Column({ type: 'json' })
  @Field(() => DemoSettings, { nullable: true })
  settings?: DemoSettings;

  @Column({ type: 'array' })
  @Field(() => [String], { nullable: 'itemsAndList' })
  permissions?: string[];

  @Column()
  @Field(() => String, { nullable: true })
  roleId: string;

  @Column()
  @Field(() => RoleTest, { nullable: true })
  role?: RoleTest;

  @Column({ type: 'array' })
  @Field(() => [String], { nullable: 'itemsAndList' })
  roleIds?: string[];

  @Column({ type: 'array' })
  @Field(() => [RoleTest], { nullable: 'itemsAndList' })
  roles?: RoleTest[];

  @Column(() => DemoUserInfo)
  @Field(() => DemoUserInfo, { nullable: true })
  userInfo?: DemoUserInfo;

  @Column()
  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}
//InputType ----------------------------------------------------------------

@InputType()
export class DemoSettingsInput {
  @Field()
  @IsBoolean()
  isVerified: boolean;

  @Field(() => DemoSettingsRoleEnum)
  @IsEnum(DemoSettingsRoleEnum)
  role: DemoSettingsRoleEnum;
}

@InputType()
export class DemoUserInfoInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  roleId: string;
}

@InputType()
export class DemoInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @Field()
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string = '';

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsPhoneNumber('VN')
  phone: string;

  @Field(() => DemoSettingsInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DemoSettingsInput)
  settings?: DemoSettingsInput;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  permissions?: string[];

  @Field()
  @IsOptional()
  @IsString()
  roleId: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roleIds?: string[];

  @Field(() => DemoUserInfoInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => DemoUserInfoInput)
  userInfo?: DemoUserInfoInput;
}

//Partial ---------------------------------------------------------------

