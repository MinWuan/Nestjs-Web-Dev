export class MilestoneReachedEvent {
  public readonly month!: number;
  public readonly year!: number;
  public readonly userId!: string;
  public readonly totalUptime!: number;
  public readonly milestone!: number;

  constructor(data: MilestoneReachedEvent) {
    Object.assign(this, data);
  }
}

// 2. Object quản lý tên và kiểu dữ liệu
export const RankRecordEvent = {
  milestoneReached: {
    name: 'rankRecord.milestoneReached',
    payload: MilestoneReachedEvent,
  },
};

