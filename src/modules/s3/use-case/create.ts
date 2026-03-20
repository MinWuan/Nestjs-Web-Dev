import { S3RepositoryTypeorm } from '../repository';

export class CreateS3UseCase {
  constructor(private s3Repository: S3RepositoryTypeorm) {}
  async execute() {}
}
