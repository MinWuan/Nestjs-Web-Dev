// import { Injectable, Scope } from '@nestjs/common';
// // import * as DataLoader from 'dataloader';
// import DataLoader = require('dataloader');
// import { PartialRole } from '@/modules/user-test/role/model/role.entity';
// import { RoleRepository } from '@/modules/user-test/role/repository/role.repository';

// @Injectable({ scope: Scope.REQUEST }) // Scope Request là bắt buộc cho DataLoader
// export class DataLoaderService {
//   constructor(private readonly roleRepository: RoleRepository) {}

//   // 1. Loader cho Roles
//   public readonly roleLoader = new DataLoader<
//     { id: string; select: string[] },
//     PartialRole
//   >(async (data: { id: string; select: string[] }[]) => {
//     const ids = data.map((k) => k.id);
//     const allSelectFields = new Set<string>();
//     data.forEach((k) =>
//       k.select.forEach((field) => allSelectFields.add(field)),
//     ); // Tập hợp tất cả các trường được yêu cầu

//     const roles = await this.roleRepository.findManyByIds({
//       ids: ids,
//       select: Array.from(allSelectFields),
//     });

//     const roleMap: Record<string, PartialRole> = {};
//     roles.forEach((role) => {
//       const key = role?._id?.toString();
//       if (key !== undefined) {
//         roleMap[key] = role;
//       }
//     }); // dùng để ánh xạ id với đối tượng Role
//     //console.log('roleMap: ', roleMap);
//     const orderedRoles = data.map((k) => roleMap[k.id]); // Ánh xạ lại theo thứ tự ban đầu
//     //console.log('orderedRoles: ', orderedRoles);
//     return orderedRoles;
//   });
// }
