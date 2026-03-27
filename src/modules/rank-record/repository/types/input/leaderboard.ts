import { LeaderboardRankRecordInput } from '@modules/rank-record/entity';

export interface LeaderboardUpsertInput {
  month: number;
  year: number;
  entry: LeaderboardRankRecordInput;
}
