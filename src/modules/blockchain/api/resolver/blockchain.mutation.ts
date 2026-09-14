import {
  Resolver,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SignatureGuard } from '@/common/guard/signature.guard';
import { AppLogger } from '@/common/logger/app.logger';
import {
  AchievementService,
} from '../../achievement.service';
import * as argsDto from '../dto/req';
import * as resDto from '../dto/res';
import { PeriodTypeEnum } from '@/modules/nft-achievement/entity/typeorm';

@Resolver()
@UseGuards(SignatureGuard)
export class BlockchainMutationResolver {
  constructor(
    private readonly achievementService: AchievementService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setPrefix('BlockchainMutationResolver');
  }

  @Mutation(() => resDto.IssueGrindReturns, { name: 'issueGrind__Achievement' })
  async issueGrind(
    @Args('input') args: argsDto.IssueGrindArgs,
  ): Promise<resDto.IssueGrindReturns> {
    this.logger.log(
      `→ GraphQL issueGrind__Achievement | learner=${args.learnerAddress} | ${args.studyHours}h | ${args.periodLabel}`,
    );

    const result = await this.achievementService.issueGrind({
      learnerAddress: args.learnerAddress,
      learnerName: args.learnerName,
      learnerEmail: args.learnerEmail,
      periodType: args.periodType as unknown as PeriodTypeEnum,
      periodLabel: args.periodLabel,
      studyHours: args.studyHours,
      rank: args.rank ?? 0,
    });

    this.logger.log(
      `← GraphQL issueGrind OK | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result as unknown as resDto.IssueGrindReturns;
  }

  @Mutation(() => resDto.IssueUnbrokenReturns, { name: 'issueUnbroken__Achievement' })
  async issueUnbroken(
    @Args('input') args: argsDto.IssueUnbrokenArgs,
  ): Promise<resDto.IssueUnbrokenReturns> {
    this.logger.log(
      `→ GraphQL issueUnbroken__Achievement | learner=${args.learnerAddress} | ${args.streakDays} days`,
    );

    const result = await this.achievementService.issueUnbroken({
      learnerAddress: args.learnerAddress,
      learnerName: args.learnerName,
      learnerEmail: args.learnerEmail,
      startDate: new Date(args.startDate),
      endDate: new Date(args.endDate),
      streakDays: args.streakDays,
    });

    this.logger.log(
      `← GraphQL issueUnbroken OK | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result as unknown as resDto.IssueUnbrokenReturns;
  }

  @Mutation(() => resDto.IssueVoyageReturns, { name: 'issueVoyage__Achievement' })
  async issueVoyage(
    @Args('input') args: argsDto.IssueVoyageArgs,
  ): Promise<resDto.IssueVoyageReturns> {
    this.logger.log(
      `→ GraphQL issueVoyage__Achievement | learner=${args.learnerAddress} | course="${args.courseName}"`,
    );

    const result = await this.achievementService.issueVoyage({
      learnerAddress: args.learnerAddress,
      learnerName: args.learnerName,
      learnerEmail: args.learnerEmail,
      courseName: args.courseName,
      completedAt: args.completedAt ? new Date(args.completedAt) : undefined,
    });

    this.logger.log(
      `← GraphQL issueVoyage OK | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result as unknown as resDto.IssueVoyageReturns;
  }
}
