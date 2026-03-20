import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { RoleInput } from '../../../entity';

@InputType()
export class CreateRoleArgs extends RoleInput {}
