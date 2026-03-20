---
name: module-entity-generator
description: Kỹ năng tạo module mới, viết entity, xử lý quan hệ (relations) và GraphQL ResolveField dựa trên template có sẵn.
---

# Kỹ năng: Tạo Module và Entity theo yêu cầu

Khi người dùng yêu cầu tạo mới hoặc viết một entity/module theo yêu cầu, bạn CẦN tuân thủ nghiêm ngặt quy trình tổng quát 7 bước dưới đây:

## 1. Clone Module mới
- Chạy lệnh terminal `node scripts/clone-module.js` (kèm tham số nếu cần) để clone một module từ template.

## 2. Đăng ký Module
- Mở file `src/modules/index.ts`.
- Import module vừa được clone và thêm nó vào danh sách các module để đăng ký với hệ thống.

## 3. Viết Entity mới
- Mở file entity vừa được clone tại `src/modules/<tên-module>/entity/typeorm/index.ts`.
- **Xoá sạch dữ liệu mẫu** trong file này.
- Viết entity mới theo đúng định nghĩa yêu cầu của người dùng.
- **QUAN TRỌNG:** Phải tuân thủ nghiêm ngặt theo các quy tắc trong SKILL tại thư mục `.agents/skills/entity-generator`.

## 4. Xử lý Quan hệ (Relations) với Module khác
Nếu yêu cầu có đề cập đến việc module mới có quan hệ với module khác hiện có:
- **Đăng ký Import:** Mở `src/modules/<tên-module>/index.ts` và thêm module liên quan (ví dụ: `UserModule`) vào mảng `imports`.
- **Không khai báo Field trong Entity:** Không cần viết các field quan hệ bên trong file Entity `src/modules/<tên-module>/entity/typeorm/index.ts` nữa. Thay vào đó, bạn chỉ định tên field đó thông qua tuỳ chọn `name` trong `@ResolveField` ở file resolver `.field.ts`.

## 5. Viết GraphQL ResolveField
Nếu có field quan hệ với một module khác cần được lấy lên (query) thông qua GraphQL, bạn phải sửa file `src/modules/<tên-module>/api/resolver/<tên-module>.field.ts` và viết các `ResolveField` cho các field đó.
- Khai báo class Resolver với decorator `@Resolver` trỏ tới Entity hiện tại.
- **Sử dụng tham số name:** Khai báo trực tiếp tên field bằng thuộc tính `name` trong `@ResolveField` (ví dụ: `@ResolveField(() => Role, { nullable: true, name: 'role' })`).
- Inject DataLoader Service tương ứng vào constructor cùng với `AppLogger`.
- Cần đảm bảo Import Module chứa DataLoader ở file `src/modules/<tên-module>/index.ts`.

**Ví dụ mẫu code cho file `.field.ts` (như User có quan hệ với Role):**
```typescript
import { Resolver, ResolveField, Parent, Info } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { AppLogger } from '@/common/logger/app.logger';
import { Role } from '@/modules/role';
import { User } from '../../entity';
import { getSelectFields } from '@/shared/utils/graphql.util';
import { RoleDataLoaderService } from '@/modules/role';

@Resolver((of) => User) //để khai báo resolver cho schema hiện tại
export class UserFieldResolver {
  constructor(
    private roleDataLoader: RoleDataLoaderService,
    private logger: AppLogger,
  ) {
    this.logger.setPrefix('UserFieldResolver');
  }

  @ResolveField(() => Role, { nullable: true, name: 'role' })
  async role(
    @Parent() user: User,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Role | null> {
    if (!user.id_role) return null;
    const selectFields = getSelectFields({
      info,
    });
    const role = await this.roleDataLoader.roleLoader.load({
      id: user.id_role.toString(),
      select: selectFields,
    });
    return role;
  }
}
```

## 6. Cập nhật `getSelectFields` trong các API Query
Sau khi hoàn thành việc viết `ResolveField` tại file `.field.ts`:
- Mở file resolver query (`src/modules/<tên-module>/api/resolver/<tên-module>.query.ts`), tìm đến 2 API `get` và `getMany`.
- Tại vị trí gọi hàm `getSelectFields`, bạn cần bổ sung tham số `relations` là một mảng chứa tên các field quan hệ vừa tạo.
- Ví dụ: `const selectFields = getSelectFields({ info, relations: ['role'] });`

## 7. Kiểm tra Lỗi Type
- Cuối cùng, **BẮT BUỘC** phải kiểm tra lại toàn bộ code trong module vừa xử lý để phát hiện lỗi TypeScript (Type errors).
- Nếu có phát hiện lỗi, phải phân tích và **sửa ngay lập tức** trước khi hoàn tất công việc.
