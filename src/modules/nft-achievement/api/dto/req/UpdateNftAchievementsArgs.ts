import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateNftAchievementArgs } from './UpdateNftAchievementArgs';

@InputType()
class UpdateNftAchievementData extends OmitType(UpdateNftAchievementArgs, ['_id'] as const) {}

@InputType()
export class UpdateNftAchievementsArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids!: string[];

  @Field(() => UpdateNftAchievementData)
  @ValidateNested()
  @Type(() => UpdateNftAchievementData)
  data!: UpdateNftAchievementData;
}
