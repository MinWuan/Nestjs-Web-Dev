---
name: TypeORM + GraphQL Entity Generator
description: Generate TypeORM entities with NestJS GraphQL integration following project conventions. Creates @ObjectType with nullable fields and @InputType with validation.
---

# TypeORM + GraphQL Entity Generator

Generate TypeORM entities with NestJS GraphQL decorators following project patterns.

## Architecture Pattern

Every entity file contains:
1. **ObjectType(s)** - Database entities with TypeORM + GraphQL decorators
2. **InputType(s)** - DTOs with validation decorators

## ObjectType Rules (Database Entities)

### Main Entity Pattern

```typescript
@Index(['uniqueField'], { unique: true }) // Optional: only if needed
@Entity('collection_name')
@ObjectType()
export class EntityName {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;
  
  @Column()
  @Field(() => String, { nullable: true })
  fieldName?: string;
  
  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  
  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
```

**Required decorators:**
- `@Entity('collection_name')` - TypeORM entity
- `@ObjectType()` - GraphQL type
- `@ObjectIdColumn()` + `@Field(() => ID)` for `_id`
- `@Column()` + `@Field()` for each field

**Optional decorators:**
- `@Index()` - Add only when needed for queries/unique constraints

**Critical rules:**
- ✅ ALL fields in ObjectType (except `_id`) MUST use optional modifier `?` (e.g., `fieldName?: string`) to support TypeORM `Partial<T>` updates
- ✅ ALL fields must have `nullable` explicitly defined in `@Field()` (`nullable: true` for scalars, `nullable: 'items'` or `'itemsAndList'` for arrays)
- ✅ Use explicit GraphQL types like `String`, `Int`, `Float`, `Boolean`, `Date`, etc.
- ✅ Use TypeORM decorators: `@Column()`, `@ObjectIdColumn()`
- ✅ Use GraphQL decorators: `@ObjectType()`, `@Field()`
- ⚠️ Use `@Index()` only when needed (unique fields, frequently queried fields)
- ❌ NO validation decorators (class-validator)
- ❌ NO class-transformer decorators

### Field Type Mapping

```typescript
// String
@Column()
@Field(() => String, { nullable: true })
name?: string;

// Number
@Column()
@Field(() => Number, { nullable: true })
age?: number;

// Integer (GraphQL Int)
@Column()
@Field(() => Int, { nullable: true })
count?: number;

// Float (GraphQL Float)
@Column()
@Field(() => Float, { nullable: true })
price?: number;

// Boolean
@Column()
@Field(() => Boolean, { nullable: true })
isActive?: boolean;

// Date
@Column()
@Field(() => Date, { nullable: true })
createdAt?: Date;

// String with predefined values (preferred over enum)
@Column()
@Field(() => String, { nullable: true })
status?: string; // Use with @IsIn() in InputType

// Enum (use sparingly)
@Column()
@Field(() => EnumType, { nullable: true })
status?: EnumType;

// Long text
@Column({ type: 'text' })
@Field(() => String, { nullable: true })
description?: string;

// JSON/Nested object
@Column({ type: 'json' })
@Field(() => NestedObjectType, { nullable: true })
settings?: NestedObjectType;

// Array of strings
@Column({ type: 'array' })
@Field(() => [String], { nullable: 'itemsAndList' })
tags?: string[];

// Array of numbers
@Column({ type: 'array' })
@Field(() => [Int], { nullable: 'itemsAndList' })
numbers?: number[];

// Array of objects
@Column({ type: 'array' })
@Field(() => [NestedObjectType], { nullable: 'itemsAndList' })
items?: NestedObjectType[];

// Embedded document
@Column(() => NestedObjectType)
@Field(() => NestedObjectType, { nullable: true })
profile?: NestedObjectType;

// Reference (relation field - no @Column)
@Field(() => PartialRelatedType, { nullable: true })
relatedObject?: PartialRelatedType;

// Hidden field (not exposed in GraphQL)
@Column()
@HideField()
internalField?: string;
```

### Nested ObjectType Pattern

```typescript
@ObjectType()
export class NestedObject {
  @Column()
  @Field(() => String, { nullable: true })
  field1?: string;
  
  @Column()
  @Field(() => Number, { nullable: true })
  field2?: number;
}
```

**Rules:**
- Use `@ObjectType()`, NOT `@Entity()`
- ALL fields (except `_id` if present) MUST be optional `?`
- ALL fields `nullable: true`
- Use `@Column()` decorator
- Can be embedded in parent entity

## InputType Rules (DTOs)

### Main Input Pattern

```typescript
@InputType()
export class EntityInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
  
  @Field(() => SettingsEntityInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsEntityInput)
  settings?: SettingsEntityInput; // Imported nested input type
}
```

**Required decorators:**
- `@InputType()` - GraphQL input type
- `@Field()` - GraphQL field
- class-validator decorators for validation

**Critical rules:**
- ✅ Use GraphQL decorators: `@InputType()`, `@Field()`
- ✅ **ALWAYS define specific type in `@Field(() => Type)` for ALL fields (e.g., `@Field(() => String)`, `@Field(() => Int)`, `@Field(() => Float)`)**
- ✅ **For optional fields, explicitly set `nullable` (e.g., `nullable: true`, `nullable: 'items'`, or `nullable: 'itemsAndList'`)**
- ✅ Use validation decorators: `@IsString()`, `@IsNotEmpty()`, etc.
- ✅ Use `@Type()` from class-transformer for nested objects
- ❌ NO TypeORM decorators (`@Column()`, `@Entity()`, etc.)
- ❌ EXCLUDE auto-generated fields: `_id`, `createdAt`, `updatedAt`

### Validation Patterns

```typescript
// String validation
@Field(() => String)
@IsString()
@IsNotEmpty()
@MinLength(2)
@MaxLength(100)
name: string;

// Email
@Field(() => String)
@IsEmail()
email: string;

// Phone (Vietnam)
@Field(() => String)
@IsPhoneNumber('VN')
phone: string;

// Mobile phone
@Field(() => String)
@IsMobilePhone('vi-VN')
mobile: string;

// URL
@Field(() => String)
@IsUrl()
website: string;

// UUID
@Field(() => String)
@IsUUID()
uuid: string;

// MongoId
@Field(() => ID)
@IsMongoId()
id: ObjectId;

// Number validation
@Field(() => Int)
@IsInt()
@Min(0)
@Max(150)
age: number;

// Positive number
@Field(() => Float)
@IsNumber()
@IsPositive()
price: number;

// Boolean
@Field(() => Boolean)
@IsBoolean()
isActive: boolean;

// String with predefined values (preferred over enum)
@Field(() => String)
@IsString()
@IsIn(['ACTIVE', 'INACTIVE', 'PENDING'])
status: string;

// Enum (use sparingly)
@Field(() => EnumType)
@IsEnum(EnumType)
status: EnumType;

// Optional field
@Field(() => String, { nullable: true })
@IsOptional()
@IsString()
@MaxLength(255)
description?: string = '';

// Array of strings
@Field(() => [String], { nullable: 'itemsAndList' })
@IsOptional()
@IsArray()
@ArrayMaxSize(20)
@IsString({ each: true })
tags?: string[];

// Array with specific values
@Field(() => [String], { nullable: 'itemsAndList' })
@IsOptional()
@IsArray()
@IsString({ each: true })
@IsIn(['READ', 'WRITE', 'DELETE'], { each: true })
permissions?: string[];

// Array unique values
@Field(() => [String], { nullable: 'itemsAndList' })
@IsOptional()
@IsArray()
@ArrayUnique()
@IsString({ each: true })
uniqueTags?: string[];

// Nested object
@Field(() => NestedObjectInput, { nullable: true })
@IsOptional()
@ValidateNested()
@Type(() => NestedObjectInput)
settings?: NestedObjectInput;

// Array of nested objects
@Field(() => [NestedObjectInput], { nullable: 'itemsAndList' })
@IsOptional()
@IsArray()
@ValidateNested({ each: true })
@Type(() => NestedObjectInput)
items?: NestedObjectInput[];

// Regex pattern matching
@Field(() => String)
@IsString()
@Matches(/^[A-Z][a-z]+$/)
code: string;

// Lowercase string
@Field(() => String)
@IsString()
@IsLowercase()
slug: string;

// Uppercase string
@Field(() => String)
@IsString()
@IsUppercase()
countryCode: string;

// Alphanumeric
@Field(() => String)
@IsString()
@IsAlphanumeric()
username: string;

// Hex color
@Field(() => String)
@IsString()
@IsHexColor()
color: string;

// JSON string
@Field(() => String)
@IsString()
@IsJSON()
jsonData: string;

// Conditional validation
@Field(() => String, { nullable: true })
@ValidateIf(o => o.requiresEmail === true)
@IsEmail()
email?: string;

// Transform before validation
@Field(() => String)
@IsString()
@Transform(({ value }) => value.trim())
name: string;

// Transform to lowercase
@Field(() => String)
@IsEmail()
@Transform(({ value }) => value.toLowerCase())
email: string;

// Date validation
@Field(() => Date)
@IsDate()
@Type(() => Date)
birthDate: Date;

// Date string
@Field(() => String)
@IsDateString()
dateString: string;
```

### Nested InputType Pattern

```typescript
@InputType()
export class NestedObjectInput {
  @Field(() => String)
  @IsString()
  field1: string;
  
  @Field(() => Int)
  @IsInt()
  @Min(0)
  field2: number;
}
```

## Enum Pattern (Use Sparingly)

**Preferred approach: String with validation**
```typescript
// ObjectType
@Column()
@Field(() => String, { nullable: true })
status?: string;

// InputType
@Field(() => String)
@IsString()
@IsIn(['ACTIVE', 'INACTIVE', 'PENDING'])
status: string;
```

**When enum is necessary:**
```typescript
enum EntityStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

registerEnumType(EntityStatusEnum, { name: 'EntityStatusEnum' });
```

**Guidelines:**
- ⚠️ Avoid enums when possible - use string + `@IsIn()` validation
- ✅ Use enums only for critical, rarely-changing constants
- Register with GraphQL using `registerEnumType()` if enum is used

## Import Organization

```typescript
// TypeORM imports
import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  Index,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// NestJS GraphQL imports
import {
  ObjectType,
  Field,
  ID,
  Int,
  Float,
  registerEnumType,
  InputType,
  OmitType,
  PartialType,
  PickType,
  IntersectionType,
  HideField,
} from '@nestjs/graphql';

// Validation imports
import {
  IsString,
  IsNotEmpty,
  IsEmpty,
  IsEmail,
  IsUrl,
  IsUUID,
  Matches,
  IsPhoneNumber,
  IsNumber,
  IsInt,
  IsPositive,
  IsNegative,
  IsDivisibleBy,
  Min,
  Max,
  MinLength,
  MaxLength,
  Length,
  IsBoolean,
  IsOptional,
  IsDefined,
  IsEnum,
  IsIn,
  IsNotIn,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  ArrayUnique,
  ArrayContains,
  ValidateNested,
  IsObject,
  IsDate,
  IsDateString,
  MinDate,
  MaxDate,
  ValidateIf,
  IsAlpha,
  IsAlphanumeric,
  IsDecimal,
  IsHexColor,
  IsJSON,
  IsJWT,
  IsLatLong,
  IsLowercase,
  IsUppercase,
  IsMobilePhone,
  IsMongoId,
  IsNumberString,
  IsPort,
  IsPostalCode,
  Contains,
  NotContains,
  Equals,
  NotEquals,
} from 'class-validator';

// Class transformer imports
import { Type, Transform, Exclude, Expose } from 'class-transformer';

// Related entities
import { PartialRelatedType } from '../path/to/related.entity';
```

## File Structure Template

### Main Entity File (index.ts)

```typescript
// 1. TypeORM imports
import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  Index,
} from 'typeorm';

// 2. NestJS GraphQL imports
import {
  ObjectType,
  Field,
  ID,
  Int,
  Float,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';

// 3. Validation imports
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

// 4. Class transformer imports
import { Type } from 'class-transformer';

// 5. Import nested objects from separate files
import { SettingsEntity, SettingsEntityInput } from './settingsEntity.entity';
import { MetadataEntity, MetadataEntityInput } from './metadataEntity.entity';

// 6. Import related entities (from other modules)
import { PartialRelatedType } from '../path/to/related.entity';

// 7. Enums (use sparingly - prefer string with @IsIn())
enum StatusEnum { ... } // Only if absolutely necessary
registerEnumType(StatusEnum, { name: 'StatusEnum' });

// 8. Main Entity ObjectType
@Index(['uniqueField'], { unique: true }) // Optional
@Entity('collection_name')
@ObjectType()
export class Entity {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;
  
  @Column()
  @Field(() => String, { nullable: true })
  name?: string;
  
  @Column({ type: 'json' })
  @Field(() => SettingsEntity, { nullable: true })
  settings?: SettingsEntity; // Imported nested type
  
  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  
  @Column()
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}

// 9. Main Entity InputType
@InputType()
export class EntityInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @Field(() => SettingsEntityInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsEntityInput)
  settings?: SettingsEntityInput; // Imported nested input type
}
```

### Nested Object File (fieldNameEntity.entity.ts)

```typescript
// 1. TypeORM imports (only Column, not Entity)
import { Column } from 'typeorm';

// 2. NestJS GraphQL imports
import { ObjectType, Field, InputType } from '@nestjs/graphql';

// 3. Validation imports
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

// 4. Class transformer imports (if needed)
import { Type } from 'class-transformer';

// 5. ObjectType
@ObjectType()
export class FieldNameEntity {
  @Column()
  @Field(() => String, { nullable: true })
  field1?: string;
  
  @Column()
  @Field(() => Boolean, { nullable: true })
  field2?: boolean;
}

// 6. InputType
@InputType()
export class FieldNameEntityInput {
  @Field(() => String)
  @IsString()
  field1: string;
  
  @Field(() => Boolean)
  @IsBoolean()
  field2: boolean;
}
```

## Quick Checklist

**File Organization:**
- [ ] Main entity in `index.ts`
- [ ] Nested objects in separate files: `{fieldName}{EntityName}.entity.ts`
- [ ] Each nested file contains BOTH ObjectType and InputType
- [ ] Proper imports in `index.ts`

**Naming Convention:**
- [ ] Main entity: `Entity` and `EntityInput`
- [ ] Nested objects: `{FieldName}{EntityName}` and `{FieldName}{EntityName}Input`
- [ ] File names: camelCase with `.entity.ts` suffix

**ObjectType (@ObjectType):**
- [ ] Has `@Entity()` decorator (main entity in index.ts only)
- [ ] Has `@ObjectType()` decorator
- [ ] ALL fields (except `_id`) MUST be optional with `?` (e.g. `fieldName?: type`) to support TypeORM `Partial<T>` updates
- [ ] All fields have `@Column()` decorator (except relations)
- [ ] All fields have `@Field(() => Type)` with an EXPLICIT type (e.g., `String`, `Int`, `Float`) and appropriate `nullable` option (`true`, `'items'`, `'itemsAndList'`)
- [ ] Has `@Index()` only when needed (optional)
- [ ] NO validation decorators
- [ ] Includes `_id`, `createdAt`, `updatedAt` (main entity only)

**InputType (@InputType):**
- [ ] Has `@InputType()` decorator
- [ ] Has `@Field(() => Type)` decorator for each field with an EXPLICIT type (e.g., `String`, `Int`, `Float`)
- [ ] If optional, has appropriate `nullable` option (`true`, `'items'`, `'itemsAndList'`)
- [ ] Has validation decorators (class-validator)
- [ ] Uses `@Type()` for nested objects
- [ ] NO TypeORM decorators
- [ ] EXCLUDES `_id`, `createdAt`, `updatedAt`

## Common Patterns

### One-to-One Relation
```typescript
// ObjectType
@Column()
@Field(() => String, { nullable: true })
profileId?: string;

@Field(() => PartialProfile, { nullable: true })
profile?: PartialProfile;

// InputType
@Field(() => String, { nullable: true })
@IsOptional()
@IsString()
profileId?: string;
```

### One-to-Many Relation
```typescript
// ObjectType
@Column({ type: 'array' })
@Field(() => [String], { nullable: 'itemsAndList' })
itemIds?: string[];

@Field(() => [PartialItem], { nullable: 'itemsAndList' })
items?: PartialItem[];

// InputType
@Field(() => [String], { nullable: 'itemsAndList' })
@IsOptional()
@IsArray()
@IsString({ each: true })
itemIds?: string[];
```

### Conditional Validation
```typescript
@Field(() => String, { nullable: true })
@ValidateIf(o => o.fieldA !== null)
@IsString()
conditionalField?: string;
```

## File Organization & Naming Convention

### Main Entity (Always in index.ts)

The main entity MUST be in `index.ts` containing both ObjectType and InputType.

**Example: Message entity in `index.ts`**
```typescript
@Entity('messages')
@ObjectType()
export class Message {
  @ObjectIdColumn()
  @Field(() => ID)
  _id: ObjectId;
  
  @Column()
  @Field(() => String, { nullable: true })
  content?: string;
  
  @Column({ type: 'json' })
  @Field(() => SettingsMessage, { nullable: true })
  settings?: SettingsMessage; // Imported from separate file
  
  @Column()
  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

@InputType()
export class MessageInput {
  @Field(() => String)
  @IsString()
  content: string;
  
  @Field(() => SettingsMessageInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsMessageInput)
  settings?: SettingsMessageInput; // Imported from separate file
}
```

### Nested Objects (Separate Files)

**Naming Pattern:** `{fieldName}{ParentEntityName}`

**File Name:** `{fieldName}{ParentEntityName}.entity.ts` (camelCase)

**Example:** For `settings` field in `Message` entity:
- File: `settingsMessage.entity.ts`
- ObjectType: `SettingsMessage`
- InputType: `SettingsMessageInput`

**File structure: `settingsMessage.entity.ts`**
```typescript
import { Column } from 'typeorm';
import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

// ObjectType
@ObjectType()
export class SettingsMessage {
  @Column()
  @Field(() => Boolean, { nullable: true })
  notifications?: boolean;
  
  @Column()
  @Field(() => String, { nullable: true })
  theme?: string;
}

// InputType
@InputType()
export class SettingsMessageInput {
  @Field(() => Boolean)
  @IsBoolean()
  notifications: boolean;
  
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  theme?: string;
}
```

**Import in index.ts:**
```typescript
import { SettingsMessage, SettingsMessageInput } from './settingsMessage.entity';
```

### Naming Examples Table

| Parent Entity | Field Name | File Name | ObjectType | InputType |
|--------------|------------|-----------|------------|-----------|
| `Message` | `settings` | `settingsMessage.entity.ts` | `SettingsMessage` | `SettingsMessageInput` |
| `Message` | `metadata` | `metadataMessage.entity.ts` | `MetadataMessage` | `MetadataMessageInput` |
| `User` | `profile` | `profileUser.entity.ts` | `ProfileUser` | `ProfileUserInput` |
| `User` | `preferences` | `preferencesUser.entity.ts` | `PreferencesUser` | `PreferencesUserInput` |
| `Order` | `shipping` | `shippingOrder.entity.ts` | `ShippingOrder` | `ShippingOrderInput` |
| `Product` | `metadata` | `metadataProduct.entity.ts` | `MetadataProduct` | `MetadataProductInput` |
| `Article` | `seo` | `seoArticle.entity.ts` | `SeoArticle` | `SeoArticleInput` |

### When to Create Separate Files

**Create separate file when:**
- ✅ Nested object has 3+ fields
- ✅ Nested object might be reused (follow naming convention)
- ✅ Better code organization and maintainability
- ✅ Complex validation logic in nested object

**Keep in index.ts when:**
- ❌ Nested object has 1-2 very simple fields
- ❌ Extremely tightly coupled to parent (rare case)

### Multi-Level Nesting

For deeply nested structures, continue the naming pattern:

**Example:** `Message` → `settings` → `notifications`
- Level 1: `Message` in `index.ts`
- Level 2: `SettingsMessage` in `settingsMessage.entity.ts`
- Level 3: `NotificationsSettingsMessage` in `notificationsSettingsMessage.entity.ts`

```typescript
// notificationsSettingsMessage.entity.ts
@ObjectType()
export class NotificationsSettingsMessage {
  @Column()
  @Field(() => Boolean, { nullable: true })
  email?: boolean;
  
  @Column()
  @Field(() => Boolean, { nullable: true })
  push?: boolean;
}

@InputType()
export class NotificationsSettingsMessageInput {
  @Field(() => Boolean)
  @IsBoolean()
  email: boolean;
  
  @Field(() => Boolean)
  @IsBoolean()
  push: boolean;
}
```

### Project Structure Example

```
entity/
└── typeorm/
    ├── index.ts                           # Main Message entity
    ├── settingsMessage.entity.ts          # Settings nested object
    ├── metadataMessage.entity.ts          # Metadata nested object
    ├── attachmentsMessage.entity.ts       # Attachments nested object
    └── SKILL.md                           # This skill file
```

**index.ts with imports:**
```typescript
// Imports from libraries
import { Entity, ObjectIdColumn, Column, ObjectId, Index } from 'typeorm';
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Import nested objects
import { SettingsMessage, SettingsMessageInput } from './settingsMessage.entity';
import { MetadataMessage, MetadataMessageInput } from './metadataMessage.entity';
import { AttachmentsMessage, AttachmentsMessageInput } from './attachmentsMessage.entity';

// Main entity
@Entity('messages')
@ObjectType()
export class Message {
  // ... fields using imported nested types
}

@InputType()
export class MessageInput {
  // ... fields using imported nested input types
}
```

### Critical Rules

1. **Main entity always in `index.ts`**
2. **Nested objects in separate files with naming pattern: `{fieldName}{ParentName}.entity.ts`**
3. **Each nested file contains BOTH ObjectType and InputType**
4. **PascalCase for types: `SettingsMessage`, `SettingsMessageInput`**
5. **camelCase for file names: `settingsMessage.entity.ts`**
6. **Import nested types in index.ts**

## Example: Complete Entity

See the reference file `index.ts` in this directory for a complete working example with:
- Main entity with multiple field types
- Nested objects (to be refactored into separate files following the convention above)
- Enums
- Relations
- Proper validation
- Index definitions
