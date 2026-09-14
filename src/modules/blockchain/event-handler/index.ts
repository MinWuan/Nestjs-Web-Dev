import type { AchievementIssuedResult } from '../achievement.service';
import { ObjectId } from 'mongodb';
export class IssueGrindCompletedEvent {
  public readonly month!: number;
  public readonly year!: number;
  public readonly userId!: ObjectId;
  public readonly milestone!: number;
  public readonly newStatus!: string;
  public readonly achievementResult!: AchievementIssuedResult;

  constructor(data: IssueGrindCompletedEvent) {
    Object.assign(this, data);
  }
}

// 2. Object quản lý tên và kiểu dữ liệu
export const BlockchainEvent = {
  issueGrindCompleted: {
    name: 'blockchain.issueGrindCompleted',
    payload: IssueGrindCompletedEvent,
  },
};
