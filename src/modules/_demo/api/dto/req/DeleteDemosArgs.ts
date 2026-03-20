import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ArrayMinSize, IsNotEmpty } from 'class-validator';

@InputType()
export class DeleteDemosArgs {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  ids: string[];
}
