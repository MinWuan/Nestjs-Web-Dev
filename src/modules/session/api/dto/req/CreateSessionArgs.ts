import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { SessionInput } from '../../../entity';

@InputType()
export class CreateSessionArgs extends SessionInput {}
