import { ObjectType } from '@nestjs/graphql';
import { AchievementIssuedResult } from '../../../entity';

@ObjectType()
export class IssueVoyageReturns extends AchievementIssuedResult {}
