import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../../../entity';

@ObjectType()
export class UpdateRoleReturns extends Role {}
