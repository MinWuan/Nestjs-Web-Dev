import { InputType, Field, Int, OmitType } from '@nestjs/graphql';
import { S3Input } from '../../../entity';

@InputType()
export class CreateS3Args extends S3Input {}
