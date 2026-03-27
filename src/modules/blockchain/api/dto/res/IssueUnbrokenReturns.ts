import { ObjectType } from '@nestjs/graphql';
import { AchievementIssuedResult } from '../../../entity';

@ObjectType()
export class IssueUnbrokenReturns extends AchievementIssuedResult {}
