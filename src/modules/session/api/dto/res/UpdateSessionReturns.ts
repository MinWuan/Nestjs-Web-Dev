import { ObjectType, Field } from '@nestjs/graphql';
import { Session } from '../../../entity';

@ObjectType()
export class UpdateSessionReturns extends Session {}
