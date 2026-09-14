import { Entity, ObjectIdColumn, Column, Index } from 'typeorm';
import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
  Int,
} from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from 'mongodb';

// ---------------------------------------------------------------
// Import Nested Types from blockchain module
// ---------------------------------------------------------------
import {
  PeriodTypeEnum,
  GrindResult,
  GrindResultInput,
  UnbrokenResult,
  VoyageResult,
} from '@/modules/blockchain/entity';

// ---------------------------------------------------------------
// Enum - CertType (reuse from blockchain)
// ---------------------------------------------------------------
export { CertTypeEnum, PeriodTypeEnum } from '@/modules/blockchain/entity';

// ---------------------------------------------------------------
// InputType - GrindAchievementInput (reuse from blockchain)
// ---------------------------------------------------------------
export { GrindResult, UnbrokenResult, VoyageResult,GrindResultInput } from '@/modules/blockchain/entity';


@InputType()
export class UnbrokenAchievementInput {
  @Field(() => Date)
  @IsNotEmpty()
  startDate!: Date;

  @Field(() => Date)
  @IsNotEmpty()
  endDate!: Date;

  @Field(() => Int)
  @IsEnum(PeriodTypeEnum)
  streakDays!: number;
}

@InputType()
export class VoyageAchievementInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  courseName!: string;

  @Field(() => Date)
  @IsNotEmpty()
  completedAt!: Date;
}

// ---------------------------------------------------------------
// ObjectType - NftAchievement
// ---------------------------------------------------------------
@Index(['tokenId'], { unique: true })
@Entity('nftAchievements')
@ObjectType()
export class NftAchievement {
  @ObjectIdColumn()
  @Field(() => ID)
  _id!: ObjectId;

  // ── On-chain identifiers ──
  @Column()
  @Field(() => String, { nullable: true })
  tokenId?: string;

  @Column()
  @Field(() => String, { nullable: true })
  certId?: string;

  @Column()
  @Field(() => String, { nullable: true })
  certType?: string;

  @Column()
  @Field(() => String, { nullable: true })
  certTypeName?: string;

  // ── Learner ──
  @Column()
  @Field(() => String, { nullable: true })
  learnerAddress?: string;

  @Column()
  @Field(() => String, { nullable: true })
  learnerName?: string;

  @Column()
  @Field(() => String, { nullable: true })
  learnerEmail?: string;

  // ── Transaction ──
  @Column()
  @Field(() => String, { nullable: true })
  txHash?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  blockNumber?: number;

  @Column()
  @Field(() => Int, { nullable: true })
  blockTimestamp?: number;

  @Column()
  @Field(() => String, { nullable: true })
  gasUsed?: string;

  @Column()
  @Field(() => String, { nullable: true })
  effectiveGasPrice?: string;

  @Column()
  @Field(() => String, { nullable: true })
  txFeeWei?: string;

  @Column()
  @Field(() => String, { nullable: true })
  txFeeCRO?: string;

  // ── Contract ──
  @Column()
  @Field(() => String, { nullable: true })
  contractAddress?: string;

  @Column()
  @Field(() => String, { nullable: true })
  network?: string;

  @Column()
  @Field(() => Int, { nullable: true })
  chainId?: number;

  // ── Timestamps ──
  @Column()
  @Field(() => Date, { nullable: true })
  issuedAt?: Date;

  @Column()
  @Field(() => String, { nullable: true })
  issuedAtIso?: string;

  // ── Cert-specific data (nested) ──
  @Column({ type: 'json', nullable: true })
  @Field(() => GrindResult, { nullable: true })
  grind?: GrindResult;

  @Column({ type: 'json', nullable: true })
  @Field(() => UnbrokenResult, { nullable: true })
  unbroken?: UnbrokenResult;

  @Column({ type: 'json', nullable: true })
  @Field(() => VoyageResult, { nullable: true })
  voyage?: VoyageResult;

  // ── Audit ──
  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

// ---------------------------------------------------------------
// InputType - NftAchievementInput
// ---------------------------------------------------------------
@InputType()
export class NftAchievementInput {
  // ── On-chain identifiers ──
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  tokenId!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  certId!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  certType?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  certTypeName?: string;

  // ── Learner ──
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  learnerAddress!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  learnerName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  learnerEmail?: string;

  // ── Transaction ──
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  txHash?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  blockNumber?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  blockTimestamp?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  gasUsed?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  effectiveGasPrice?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  txFeeWei?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  txFeeCRO?: string;

  // ── Contract ──
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  contractAddress?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  network?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  chainId?: number;

  // ── Timestamps ──
  @Field(() => Date, { nullable: true })
  @IsOptional()
  issuedAt?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  issuedAtIso?: string;

  // ── Cert-specific data ──
  @Field(() => GrindResultInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => GrindResultInput)
  grind?: GrindResultInput;

  @Field(() => UnbrokenAchievementInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => UnbrokenAchievementInput)
  unbroken?: UnbrokenAchievementInput;

  @Field(() => VoyageAchievementInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => VoyageAchievementInput)
  voyage?: VoyageAchievementInput;
}
