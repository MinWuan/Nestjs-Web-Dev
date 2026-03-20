import { ObjectType, Field } from '@nestjs/graphql';
import { RoleTest } from '../../../entity';

@ObjectType()
export class CreateRoleTestReturns extends RoleTest {}