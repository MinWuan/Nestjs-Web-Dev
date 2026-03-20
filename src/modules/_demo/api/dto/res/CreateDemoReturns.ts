import { ObjectType, Field } from '@nestjs/graphql';
import { Demo } from '../../../entity';

@ObjectType()
export class CreateDemoReturns extends Demo {}