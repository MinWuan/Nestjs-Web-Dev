import { ObjectType, Field } from '@nestjs/graphql';
import { RankRecord } from '../../../entity';

@ObjectType()
export class SubCreatedRankRecordReturns {
  @Field(() => RankRecord, { nullable: true })
  data!: RankRecord;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
