# Project Name

NestJS GraphQL API với MongoDB, Redis và AWS S3 Integration.

## Mô tả ngắn

Dự án backend NestJS sử dụng GraphQL API, TypeORM với MongoDB, caching với Redis, authentication JWT, và upload file qua AWS S3.

## Tech Stack

- **Runtime:** Bun / Node.js
- **Framework:** NestJS 11
- **Database:** TypeORM + MongoDB
- **GraphQL:** Apollo Server (@nestjs/graphql)
- **Auth:** JWT (@nestjs/jwt)
- **Cache:** Redis (via ioredis)
- **File Storage:** AWS S3
- **Blockchain:** Ethers.js (ethers v6)
- **Validation:** class-validator, class-transformer

## Các Module

### User Module (`src/modules/user/`)

Quản lý người dùng với profile phong phú.

**Entity chính: `User`**
- Thông tin cơ bản: `fullname`, `email`, `password`, `phone`, `gender`, `birthday`, `bio`, `avatar`
- Membership: `membershipType` (free/silver/gold/diamond), `membershipExpiredAt`, `coin`
- Trạng thái: `status`, `type`
- Social: `listFriendId`, `friendRequestsId`
- Timestamps: `createdAt`, `updatedAt`

**Sub-entities:**
- `LocationUser` - Địa chỉ (country, city, ward, address)
- `ExperiencesUser` - Kinh nghiệm làm việc (title, company, description, location, startDate, endDate, isCurrent)
- `EducationsUser` - Học vấn (degree, fieldOfStudy, school, location, startDate, endDate)
- `BadgesUser` - Huy hiệu (name, type, description, iconUrl, awardedAt, expiresAt, awardedBy)
- `PermissionsUser` - Quyền hạn (name, description, limit) - ví dụ: UPLOAD_FILE

**Relationship:**
- `id_role` - Liên kết với Role module
- `permissions[]` - Danh sách quyền riêng của user

### Role Module (`src/modules/role/`)

Quản lý vai trò người dùng.

**Entity chính: `Role`**
- Enum: `ROOT`, `ADMIN`, `USER`, `GUEST`, `DEV`
- Mô tả: `description`
- Timestamps: `createdAt`, `updatedAt`

### S3 Module (`src/modules/s3/`)

Quản lý upload và lưu trữ file trên AWS S3.

**Entity chính: `S3`**
- File metadata: `key`, `url`, `mimetype`, `originalname`, `size`, `bucket`
- Liên kết: `authorId` (ObjectId của user upload)
- Timestamps: `createdAt`, `updatedAt`

### Post Module (`src/modules/post/`)

Quản lý bài viết với nội dung phong phú và hệ thống phản hồi.

**Entity chính: `Post`**
- Thông tin cơ bản: `slug` (unique), `title`, `description`, `content`
- Table of Contents: `toc[]` - danh sách tiêu đề phụ (title, id, tag)
- Media: `thumbnail`, `link` (image[], video[])
- Phân loại: `category[]`, `tags[]`, `keywords[]`
- Trạng thái: `status` (DRAFT, PUBLISHED, ARCHIVED, PENDING)
- Metrics: `view`, `rank`
- Timestamps: `createdAt`, `updatedAt`

**Sub-entities:**
- `TocPost` - Mục lục bài viết (title, id, tag)
- `LinkPost` - Liên kết media (image[], video[])
- `ReactionsPost` - Phản hồi (listUserId[], type) - ví dụ: heart, unicorn, surprised, clap, fire

**Relationship:**
- `id_author` → `author` - Liên kết với User module (tác giả bài viết)
- `id_sharedByListUserId` → `sharedByListUserId[]` - Danh sách user đã chia sẻ bài viết

**Indexes:**
- `slug` (unique)
- `slug, createdAt, status`
- `status, category, createdAt`
- `status, createdAt`

### Session Module (`src/modules/session/`)

Quản lý phiên làm việc của người dùng.

**Entity chính: `Session`**
- Session data: `sessionId`, `data`
- Người dùng: `userId`
- Trạng thái: `isActive`
- Timestamps: `createdAt`, `updatedAt`, `expiresAt`

## API Reference (GraphQL)

### User Types

```graphql
type User {
  _id: ID!
  fullname: String
  email: String
  status: String
  phone: String
  gender: String
  birthday: DateTime
  bio: String
  coin: Float
  membershipType: String
  membershipExpiredAt: DateTime
  location: LocationUser
  experiences: [ExperiencesUser]
  educations: [EducationsUser]
  badges: [BadgesUser]
  avatar: String
  type: String
  id_role: String
  listFriendId: [String]
  friendRequestsId: [String]
  permissions: [PermissionsUser]
  createdAt: DateTime
  updatedAt: DateTime
}

type LocationUser {
  country: String
  city: String
  ward: String
  address: String
}

type ExperiencesUser {
  title: String
  description: String
  company: String
  location: LocationExperiencesUser
  startDate: DateTime
  endDate: DateTime
  isCurrent: Boolean
}

type EducationsUser {
  degree: String
  fieldOfStudy: String
  school: String
  location: LocationEducationsUser
  startDate: DateTime
  endDate: DateTime
}

type BadgesUser {
  name: String
  type: String
  description: String
  iconUrl: String
  awardedAt: DateTime
  expiresAt: DateTime
  awardedBy: String
}

type PermissionsUser {
  name: String
  description: String
  limit: String
}
```

### Role Types

```graphql
enum RoleEnum {
  ROOT
  ADMIN
  USER
  GUEST
  DEV
}

type Role {
  _id: ID!
  role: RoleEnum
  description: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

### S3 Types

```graphql
type S3 {
  _id: ID!
  key: String
  url: String
  mimetype: String
  originalname: String
  size: Float
  bucket: String
  authorId: ID!
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Post Types

```graphql
enum statusPost {
  DRAFT
  PUBLISHED
  ARCHIVED
  PENDING
}

type TocPost {
  title: String
  id: String
  tag: String
}

type LinkPost {
  image: [String]
  video: [String]
}

type ReactionsPost {
  listUserId: [String]
  type: String
}

type Post {
  _id: ID!
  slug: String
  title: String
  description: String
  content: String
  toc: [TocPost]
  thumbnail: String
  link: LinkPost
  category: [String]
  status: statusPost
  id_author: String
  author: User
  id_sharedByListUserId: [String]
  sharedByListUserId: [User]
  view: Int
  rank: Int
  tags: [String]
  keywords: [String]
  reactions: [ReactionsPost]
  createdAt: DateTime
  updatedAt: DateTime
}

input TocPostInput {
  title: String!
  id: String!
  tag: String!
}

input LinkPostInput {
  image: [String]
  video: [String]
}

input ReactionsPostInput {
  listUserId: [String]
  type: String
}

input PostInput {
  slug: String!
  title: String!
  description: String
  content: String!
  toc: [TocPostInput]
  thumbnail: String
  link: LinkPostInput
  category: [String]
  status: statusPost!
  id_author: ID!
  id_sharedByListUserId: [String]
  view: Int
  rank: Int
  tags: [String]
  keywords: [String]
  reactions: [ReactionsPostInput]
}
```

### Session Types

```graphql
type Session {
  _id: ID!
  sessionId: String!
  data: String
  userId: String!
  isActive: Boolean
  createdAt: DateTime
  updatedAt: DateTime
  expiresAt: DateTime
}
```

## Cấu hình Environment

```bash
# Database (MongoDB)
DATABASE_HOST=localhost
DATABASE_PORT=27017
DATABASE_NAME=app_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=bucket-name
AWS_REGION=us-east-1
```

## Cài đặt và Chạy

```bash
# Cài đặt dependencies (sử dụng Bun)
bun install

# Development (watch mode)
bun run bun:dev

# Build
bun run bun:build

# Production
bun run bun:start:prod

# Tests
bun test
bun run test:cov
```

### Alternative Scripts (npm/node)

```bash
npm install

# Development
npm run dev

# Build
npm run build

# Start Production
npm run start:prod

# Tests
npm run test
npm run test:cov
```

## Cấu trúc Dự án

```
src/
├── modules/
│   ├── user/
│   │   └── entity/
│   │       └── typeorm/
│   │           ├── index.ts           # User, UserInput
│   │           ├── locationUser.entity.ts
│   │           ├── experiencesUser.entity.ts
│   │           ├── educationsUser.entity.ts
│   │           ├── badgesUser.entity.ts
│   │           └── permissionsUser.entity.ts
│   ├── role/
│   │   └── entity/
│   │       └── typeorm/
│   │           └── index.ts          # Role, RoleInput, RoleEnum
│   ├── s3/
│   │   └── entity/
│   │       └── typeorm/
│   │           └── index.ts          # S3, S3Input
│   ├── post/
│   │   ├── constants/
│   │   │   └── common.ts             # statusPost enum
│   │   └── entity/
│   │       └── typeorm/
│   │           ├── index.ts          # Post, PostInput
│   │           ├── tocPost.entity.ts
│   │           ├── linkPost.entity.ts
│   │           └── reactionsPost.entity.ts
│   ├── session/
│   │   └── entity/
│   │       └── typeorm/
│   │           └── index.ts         # Session, SessionInput
│   └── blockchain/
├── common/
│   └── logger/
│       └── app.logger.ts             # Custom logger
├── app.controller.ts
├── app.module.ts
├── main.ts
└── server.app.ts
```

## Dependencies quan trọng

| Package | Version | Mục đích |
|---------|---------|-----------|
| @nestjs/graphql | 13.2.0 | GraphQL integration |
| @nestjs/apollo | 13.2.1 | Apollo Server |
| @nestjs/typeorm | 11.0.0 | TypeORM integration |
| typeorm | 0.3.28 | ORM (MongoDB) |
| mongodb | 6.21.0 | MongoDB driver |
| @nestjs/jwt | 11.0.2 | JWT authentication |
| ioredis | 5.5.0 | Redis client |
| @nestjs/cache-manager | 3.1.0 | Caching |
| ethers | 6.16.0 | Blockchain utilities |
| bcryptjs | 3.0.2 | Password hashing |
| class-validator | 0.14.1 | DTO validation |
| class-transformer | 0.5.1 | Object transformation |

## Changelog

### [v0.0.2] - 2026-03-24

- Thêm **Post Module** với entities: Post, TocPost, LinkPost, ReactionsPost
- Thêm **Session Module** với entity: Session
- Post Module hỗ trợ relations với User (author, sharedByListUserId)
- Thêm DataLoader pattern cho việc resolve relations

### [v0.0.1] - 2026-03-23

- Thêm **User Module** với entities: User, LocationUser, ExperiencesUser, EducationsUser, BadgesUser, PermissionsUser
- Thêm **Role Module** với RoleEnum (ROOT, ADMIN, USER, GUEST, DEV)
- Thêm **S3 Module** cho upload file lên AWS S3
- Cấu hình TypeORM với MongoDB
- Cấu hình GraphQL với Apollo Server
- Thêm custom AppLogger
- Setup CI/CD với GitHub Actions
- Chuyển từ npm sang Bun runtime

## Nguyên tắc phát triển

### Đặt tên

- Entity: PascalCase (VD: `User`, `Role`)
- Type/Interface: PascalCase (VD: `UserInput`, `LocationUser`)
- Enum values: UPPERCASE (VD: `ADMIN`, `USER`)
- File: camelCase hoặc kebab-case (VD: `user.service.ts`, `user-module.ts`)

### Validation

- Sử dụng `class-validator` decorators cho Input types
- Sử dụng `class-transformer` cho type conversion
- Luôn đánh dấu optional fields với `@IsOptional()`

### GraphQL

- Sử dụng `@ObjectType()` cho response types
- Sử dụng `@InputType()` cho mutation inputs
- Sử dụng `@HideField()` cho sensitive data (VD: password)
- Nullable fields: dùng `nullable: true` hoặc `?`

## License

UNLICENSED
