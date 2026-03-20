import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../../entity';

@ObjectType()
export class CreateUserReturns extends User {}