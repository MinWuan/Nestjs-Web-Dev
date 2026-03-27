import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/graphql';
import { UpdateSessionArgs } from './UpdateSessionArgs';

@InputType()
class UpdateSessionData extends OmitType(UpdateSessionArgs, ['_id'] as const) {}

@InputType()
export class UpdateSessionsArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids!: string[];

  @Field(() => UpdateSessionData)
  @ValidateNested()
  @Type(() => UpdateSessionData)
  data!: UpdateSessionData;
}
