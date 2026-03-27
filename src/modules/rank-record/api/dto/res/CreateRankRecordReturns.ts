import { ObjectType, Field } from '@nestjs/graphql';
import { RankRecord } from '../../../entity';

@ObjectType()
export class CreateRankRecordReturns extends RankRecord {}