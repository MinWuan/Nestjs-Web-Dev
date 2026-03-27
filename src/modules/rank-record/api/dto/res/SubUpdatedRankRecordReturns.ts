import { ObjectType, Field } from '@nestjs/graphql';
import { RankRecord } from '../../../entity';

@ObjectType()
export class SubUpdatedRankRecordReturns {
  @Field(() => RankRecord, { nullable: true })
  data!: RankRecord;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
