import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { NftAchievementInput } from '../../../entity';

@InputType()
export class CreateNftAchievementArgs extends NftAchievementInput {}
