import { registerEnumType } from '@nestjs/graphql';

export enum UserStatusEnum {
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  BANNED = 'BANNED',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

registerEnumType(UserStatusEnum, {
  name: 'UserStatusEnum',
  description: 'User account status',
});

export enum UserMembershipTypeEnum {
  FREE = 'free',
  SILVER = 'silver',
  GOLD = 'gold',
  DIAMOND = 'diamond',
}

registerEnumType(UserMembershipTypeEnum, {
  name: 'UserMembershipTypeEnum',
  description: 'User membership type',
});
