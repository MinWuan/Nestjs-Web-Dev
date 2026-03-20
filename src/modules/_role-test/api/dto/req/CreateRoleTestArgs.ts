import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { RoleTestInput } from '../../../entity';

@InputType()
export class CreateRoleTestArgs extends RoleTestInput {}
