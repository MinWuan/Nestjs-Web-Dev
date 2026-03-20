import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { UserInput } from '../../../entity';

@InputType()
export class CreateUserArgs extends UserInput {}
