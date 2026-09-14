import { ObjectType, Field } from '@nestjs/graphql';
import { NftAchievement } from '../../../entity';

@ObjectType()
export class UpdateNftAchievementReturns extends NftAchievement {}
