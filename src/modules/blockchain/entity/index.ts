import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Int,
  Float,
} from '@nestjs/graphql';

// ---------------------------------------------------------------
// Enum
// ---------------------------------------------------------------
export enum CertTypeEnum {
  THE_GRIND = 0,
  UNBROKEN = 1,
  VOYAGE_COMPLETE = 2,
}

registerEnumType(CertTypeEnum, { name: 'CertTypeEnum' });

export enum PeriodTypeEnum {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  CUSTOM = 3,
}

registerEnumType(PeriodTypeEnum, { name: 'PeriodTypeEnum' });

// ---------------------------------------------------------------
// ObjectType
// ---------------------------------------------------------------

@ObjectType()
export class GrindResult {
  @Field(() => PeriodTypeEnum)
  periodType!: PeriodTypeEnum;

  @Field(() => String)
  periodLabel!: string;

  @Field(() => Int)
  studyHours!: number;

  @Field(() => Int)
  rank!: number;
}

@ObjectType()
export class UnbrokenResult {
  @Field(() => Date)
  startDate!: Date;

  @Field(() => Date)
  endDate!: Date;

  @Field(() => Int)
  streakDays!: number;
}

@ObjectType()
export class VoyageResult {
  @Field(() => String)
  courseName!: string;

  @Field(() => Date)
  completedAt!: Date;
}

@ObjectType()
export class AchievementIssuedResult {
  @Field(() => String)
  tokenId!: string;

  @Field(() => String)
  certId!: string;

  @Field(() => CertTypeEnum)
  certType!: CertTypeEnum;

  @Field(() => String)
  certTypeName!: string;

  @Field(() => String)
  learnerAddress!: string;

  @Field(() => String)
  learnerName!: string;

  @Field(() => String)
  learnerEmail!: string;

  @Field(() => String)
  txHash!: string;

  @Field(() => Int)
  blockNumber!: number;

  @Field(() => Int)
  blockTimestamp!: number;

  @Field(() => String)
  gasUsed!: string;

  @Field(() => String)
  effectiveGasPrice!: string;

  @Field(() => String)
  txFeeWei!: string;

  @Field(() => String)
  txFeeCRO!: string;

  @Field(() => String)
  contractAddress!: string;

  @Field(() => String)
  network!: string;

  @Field(() => Int)
  chainId!: number;

  @Field(() => Date)
  issuedAt!: Date;

  @Field(() => String)
  issuedAtIso!: string;

  @Field(() => GrindResult, { nullable: true })
  grind?: GrindResult;

  @Field(() => UnbrokenResult, { nullable: true })
  unbroken?: UnbrokenResult;

  @Field(() => VoyageResult, { nullable: true })
  voyage?: VoyageResult;
}
