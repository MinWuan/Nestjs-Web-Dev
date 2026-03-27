import { ObjectType, Field } from '@nestjs/graphql';
import { AchievementIssuedResult } from '../../../entity';

@ObjectType()
export class IssueGrindReturns extends AchievementIssuedResult {}
