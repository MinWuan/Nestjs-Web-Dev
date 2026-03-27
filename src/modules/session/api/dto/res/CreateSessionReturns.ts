import { ObjectType, Field } from '@nestjs/graphql';
import { Session } from '../../../entity';

@ObjectType()
export class CreateSessionReturns extends Session {}