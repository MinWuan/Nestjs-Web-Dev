import { ObjectType, Field } from '@nestjs/graphql';
import { NftAchievement } from '../../../entity';

@ObjectType()
export class CreateNftAchievementReturns extends NftAchievement {}