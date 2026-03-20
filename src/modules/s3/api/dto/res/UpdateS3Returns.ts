import { ObjectType, Field } from '@nestjs/graphql';
import { S3 } from '../../../entity';

@ObjectType()
export class UpdateS3Returns extends S3 {}
