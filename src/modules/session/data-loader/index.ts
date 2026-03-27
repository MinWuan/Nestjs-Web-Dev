import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
import DataLoader = require('dataloader');
import { Session } from '../entity';
import { SessionRepositoryTypeorm } from '../repository';

@Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
export class SessionDataLoaderService {
  constructor(private readonly sessionRepository: SessionRepositoryTypeorm) {}
  // 1. Loader cho Session
  public readonly sessionLoader = new DataLoader<
    { id: string; select: string[] },
    Session
  >(async (data:readonly { id: string; select: string[] }[]) => {
    const ids = data.map((k) => k.id);
    const allSelectFields = new Set<string>();
    data.forEach((k) =>
      k.select.forEach((field) => allSelectFields.add(field)),
    ); // Tập hợp tất cả các trường được yêu cầu

    const items = await this.sessionRepository.findManyByIds({
      ids: ids,
      select: Array.from(allSelectFields),
    });

    const itemMap: Record<string, Session> = {};
    items.forEach((session) => {
      const key = session?._id?.toString();
      if (key !== undefined) {
        itemMap[key] = session;
      }
    }); // dùng để ánh xạ id với đối tượng
    const orderedItems = data.map((k) => itemMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
    return orderedItems;
  });
}
