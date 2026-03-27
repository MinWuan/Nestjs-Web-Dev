import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { RoleEnum } from '@modules/role/entity';

@ObjectType()
export class AuthRole {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => RoleEnum, { nullable: true })
  role!: RoleEnum;
}

@ObjectType()
export class AuthData {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => ID, { nullable: true })
  id_user!: ObjectId;

  @Field(() => ID, { nullable: true })
  session_id!: ObjectId;

  @Field(() => AuthRole, { nullable: true })
  id_role!: AuthRole;
}

@ObjectType()
export class AuthResult {
  @Field(() => AuthData, { nullable: true })
  data!: AuthData;

  @Field(() => String, { nullable: true })
  token!: string;

  @Field(() => String, { nullable: true })
  message?: string;
}
