import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  InputType,
  Float,
  HideField,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDate,
  IsIn,
  IsNumber,
  IsArray,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

import { LocationUser, LocationUserInput } from './locationUser.entity';
import {
  ExperiencesUser,
  ExperiencesUserInput,
} from './experiencesUser.entity';
import { EducationsUser, EducationsUserInput } from './educationsUser.entity';
import { BadgesUser, BadgesUserInput } from './badgesUser.entity';
import {
  PermissionsUser,
  PermissionsUserInput,
} from './permissionsUser.entity';
import { UserStatusEnum, UserMembershipTypeEnum } from './enums.user.entity';
import { Role } from '@modules/role';

@Entity('users')
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  _id!: ObjectId;

  @Column()
  @Field(() => String, { nullable: true })
  fullname?: string;

  @Column()
  @Field(() => String, { nullable: true })
  email?: string;

  @Column()
  @HideField()
  password?: string;

  @Column()
  @Field(() => UserStatusEnum, { nullable: true })
  @IsIn(Object.values(UserStatusEnum))
  status?: UserStatusEnum;

  @Column()
  @Field(() => String, { nullable: true })
  phone?: string;

  @Column()
  @Field(() => String, { nullable: true })
  gender?: string;

  @Column()
  @Field(() => Date, { nullable: true })
  birthday?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  bio?: string;

  @Column()
  @Field(() => Float, { nullable: true })
  coin?: number;

  @Column()
  @Field(() => UserMembershipTypeEnum, { nullable: true })
  @IsIn(Object.values(UserMembershipTypeEnum))
  membershipType?: UserMembershipTypeEnum;

  @Column()
  @Field(() => Date, { nullable: true })
  membershipExpiredAt?: Date;

  @Column(() => LocationUser)
  @Field(() => LocationUser, { nullable: true })
  location?: LocationUser;

  @Column(() => ExperiencesUser)
  @Field(() => [ExperiencesUser], { nullable: 'itemsAndList' })
  experiences?: ExperiencesUser[];

  @Column(() => EducationsUser)
  @Field(() => [EducationsUser], { nullable: 'itemsAndList' })
  educations?: EducationsUser[];

  @Column(() => BadgesUser)
  @Field(() => [BadgesUser], { nullable: 'itemsAndList' })
  badges?: BadgesUser[];

  @Column()
  @Field(() => String, { nullable: true })
  avatar?: string;

  @Column()
  @Field(() => String, { nullable: true })
  type?: string;

  @Column()
  @Field(() => String, { nullable: true })
  id_role?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;

  @Column()
  @Field(() => String, { nullable: true })
  walletAddress?: string;

  @Column({ type: 'array' })
  @Field(() => [String], { nullable: 'itemsAndList' })
  listFriendId?: string[];

  @Column({ type: 'array' })
  @Field(() => [String], { nullable: 'itemsAndList' })
  friendRequestsId?: string[];

  @Column(() => PermissionsUser)
  @Field(() => [PermissionsUser], { nullable: 'itemsAndList' })
  permissions?: PermissionsUser[];

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

@InputType()
export class UserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  fullname!: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field(() => UserStatusEnum, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(UserStatusEnum))
  status?: UserStatusEnum;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  coin?: number;

  @Field(() => UserMembershipTypeEnum, { nullable: true })
  @IsOptional()
  @IsIn(Object.values(UserMembershipTypeEnum))
  membershipType?: UserMembershipTypeEnum;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  membershipExpiredAt?: Date;

  @Field(() => LocationUserInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationUserInput)
  location?: LocationUserInput;

  @Field(() => [ExperiencesUserInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperiencesUserInput)
  experiences?: ExperiencesUserInput[];

  @Field(() => [EducationsUserInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationsUserInput)
  educations?: EducationsUserInput[];

  @Field(() => [BadgesUserInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BadgesUserInput)
  badges?: BadgesUserInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsMongoId()
  id_role?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  walletAddress?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  listFriendId?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  friendRequestsId?: string[];

  @Field(() => [PermissionsUserInput], { nullable: 'itemsAndList' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionsUserInput)
  permissions?: PermissionsUserInput[];
}
