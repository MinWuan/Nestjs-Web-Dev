import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
import DataLoader = require('dataloader');
import { S3 } from '../entity';
import { S3RepositoryTypeorm } from '../repository';

@Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
export class S3DataLoaderService {
  constructor(private readonly s3Repository: S3RepositoryTypeorm) {}
  // 1. Loader cho S3
  public readonly s3Loader = new DataLoader<
    { id: string; select: string[] },
    S3
  >(async (data:readonly { id: string; select: string[] }[]) => {
    const ids = data.map((k) => k.id);
    const allSelectFields = new Set<string>();
    data.forEach((k) =>
      k.select.forEach((field) => allSelectFields.add(field)),
    ); // Tập hợp tất cả các trường được yêu cầu

    const items = await this.s3Repository.findManyByIds({
      ids: ids,
      select: Array.from(allSelectFields),
    });

    const itemMap: Record<string, S3> = {};
    items.forEach((s3) => {
      const key = s3?._id?.toString();
      if (key !== undefined) {
        itemMap[key] = s3;
      }
    }); // dùng để ánh xạ id với đối tượng
    const orderedItems = data.map((k) => itemMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
    return orderedItems;
  });
}
