import { Injectable, Scope } from '@nestjs/common';
// import * as DataLoader from 'dataloader';
import DataLoader = require('dataloader');
import { NftAchievement } from '../entity';
import { NftAchievementRepositoryTypeorm } from '../repository';

@Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
export class NftAchievementDataLoaderService {
  constructor(private readonly nftAchievementRepository: NftAchievementRepositoryTypeorm) {}
  // 1. Loader cho NftAchievement
  public readonly nftAchievementLoader = new DataLoader<
    { id: string; select: string[] },
    NftAchievement
  >(async (data:readonly { id: string; select: string[] }[]) => {
    const ids = data.map((k) => k.id);
    const allSelectFields = new Set<string>();
    data.forEach((k) =>
      k.select.forEach((field) => allSelectFields.add(field)),
    ); // Tập hợp tất cả các trường được yêu cầu

    const items = await this.nftAchievementRepository.findManyByIds({
      ids: ids,
      select: Array.from(allSelectFields),
    });

    const itemMap: Record<string, NftAchievement> = {};
    items.forEach((nftAchievement) => {
      const key = nftAchievement?._id?.toString();
      if (key !== undefined) {
        itemMap[key] = nftAchievement;
      }
    }); // dùng để ánh xạ id với đối tượng
    const orderedItems = data.map((k) => itemMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
    return orderedItems;
  });
}
