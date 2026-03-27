import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { RankRecordInput } from '../../../entity';

@InputType()
export class CreateRankRecordArgs extends RankRecordInput {}
