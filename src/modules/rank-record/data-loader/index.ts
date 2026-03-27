import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
import DataLoader = require('dataloader');
import { RankRecord } from '../entity';
import { RankRecordRepositoryTypeorm } from '../repository';

@Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
export class RankRecordDataLoaderService {
  constructor(private readonly rankRecordRepository: RankRecordRepositoryTypeorm) {}
  // 1. Loader cho RankRecord
  public readonly rankRecordLoader = new DataLoader<
    { id: string; select: string[] },
    RankRecord
  >(async (data:readonly { id: string; select: string[] }[]) => {
    const ids = data.map((k) => k.id);
    const allSelectFields = new Set<string>();
    data.forEach((k) =>
      k.select.forEach((field) => allSelectFields.add(field)),
    ); // Tập hợp tất cả các trường được yêu cầu

    const items = await this.rankRecordRepository.findManyByIds({
      ids: ids,
      select: Array.from(allSelectFields),
    });

    const itemMap: Record<string, RankRecord> = {};
    items.forEach((rankRecord) => {
      const key = rankRecord?._id?.toString();
      if (key !== undefined) {
        itemMap[key] = rankRecord;
      }
    }); // dùng để ánh xạ id với đối tượng
    const orderedItems = data.map((k) => itemMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
    return orderedItems;
  });
}
