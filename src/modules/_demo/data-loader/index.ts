import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
import DataLoader = require('dataloader');
import { Demo } from '../entity';
import { DemoRepositoryTypeorm } from '../repository';

@Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
export class DemoDataLoaderService {
  constructor(private readonly demoRepository: DemoRepositoryTypeorm) {}
  // 1. Loader cho Demo
  public readonly demoLoader = new DataLoader<
    { id: string; select: string[] },
    Demo
  >(async (data:readonly { id: string; select: string[] }[]) => {
    const ids = data.map((k) => k.id);
    const allSelectFields = new Set<string>();
    data.forEach((k) =>
      k.select.forEach((field) => allSelectFields.add(field)),
    ); // Tập hợp tất cả các trường được yêu cầu

    const items = await this.demoRepository.findManyByIds({
      ids: ids,
      select: Array.from(allSelectFields),
    });

    const itemMap: Record<string, Demo> = {};
    items.forEach((role) => {
      const key = role?._id?.toString();
      if (key !== undefined) {
        itemMap[key] = role;
      }
    }); // dùng để ánh xạ id với đối tượng
    const orderedItems = data.map((k) => itemMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
    return orderedItems;
  });
}
