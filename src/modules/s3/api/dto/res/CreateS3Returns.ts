import { ObjectType, Field } from '@nestjs/graphql';
import { S3 } from '../../../entity';

@ObjectType()
export class CreateS3Returns extends S3 {}