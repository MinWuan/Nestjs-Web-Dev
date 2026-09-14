import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateNftAchievementArgs } from './CreateNftAchievementArgs';

@InputType()
export class CreateNftAchievementsArgs {
  @Field(() => [CreateNftAchievementArgs])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateNftAchievementArgs)
  nftAchievements!: CreateNftAchievementArgs[];
}
