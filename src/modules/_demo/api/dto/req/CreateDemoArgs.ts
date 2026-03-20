import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { DemoInput } from '../../../entity';

@InputType()
export class CreateDemoArgs extends DemoInput {}
