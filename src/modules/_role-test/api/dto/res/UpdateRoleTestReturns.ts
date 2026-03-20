import { ObjectType, Field } from '@nestjs/graphql';
import { RoleTest } from '../../../entity';

@ObjectType()
export class UpdateRoleTestReturns extends RoleTest {}
