import { ObjectType, Field } from '@nestjs/graphql';
import { NftAchievement } from '../../../entity';

@ObjectType()
export class SubCreatedNftAchievementReturns {
  @Field(() => NftAchievement, { nullable: true })
  data!: NftAchievement;

  @Field(() => String, { nullable: true })
  deviceId!: string;
}
