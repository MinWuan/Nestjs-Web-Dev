import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ethers,
  Contract,
  Wallet,
  JsonRpcProvider,
  TransactionReceipt,
  EventLog,
  Log,
} from 'ethers';
import { AppLogger } from '@/common/logger/app.logger';
import { config } from '@/config.app';

// ─── Types ────────────────────────────────────────────────────────────────────

export enum CertType {
  THE_GRIND = 0,
  UNBROKEN = 1,
  VOYAGE_COMPLETE = 2,
}

export enum PeriodType {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  CUSTOM = 3,
}

/** Kết quả đầy đủ trả về sau mỗi lần cấp chứng nhận */
export interface AchievementIssuedResult {
  // ── On-chain identifiers ──
  tokenId: string; // Token ID dạng string (bigint safe)
  certId: string; // VD: "DT-GRND-00001"
  certType: CertType;
  certTypeName: string; // "The Grind" | "Unbroken" | "Voyage Complete"

  // ── Learner ──
  learnerAddress: string; // địa chỉ ví học viên
  learnerName: string;
  learnerEmail: string;

  // ── Transaction ──
  txHash: string;
  blockNumber: number;
  blockTimestamp: number; // unix seconds
  gasUsed: string; // wei string
  effectiveGasPrice: string; // wei string
  txFeeWei: string; // gasUsed × gasPrice (wei)
  txFeeCRO: string; // đơn vị CRO (18 decimals), 6 chữ số thập phân

  // ── Contract ──
  contractAddress: string;
  network: string; // "cronosTestnet" | "cronosMainnet"
  chainId: number;

  // ── Timestamps ──
  issuedAt: Date; // block timestamp dạng Date
  issuedAtIso: string; // ISO 8601

  // ── Cert-specific data ──
  grind?: GrindResult;
  unbroken?: UnbrokenResult;
  voyage?: VoyageResult;
}

export interface GrindResult {
  periodType: PeriodType;
  periodLabel: string;
  studyHours: number;
  rank: number; // 0 = không có rank
}

export interface UnbrokenResult {
  startDate: Date;
  endDate: Date;
  streakDays: number;
}

export interface VoyageResult {
  courseName: string;
  completedAt: Date;
}

/** Input cho issueGrind */
export interface IssueGrindInput {
  learnerAddress: string;
  learnerName: string;
  learnerEmail: string;
  periodType: PeriodType;
  periodLabel: string; // VD: "Tháng 03/2026"
  studyHours: number;
  rank?: number; // optional, default 0
}

/** Input cho issueUnbroken */
export interface IssueUnbrokenInput {
  learnerAddress: string;
  learnerName: string;
  learnerEmail: string;
  startDate: Date | number; // Date object hoặc unix timestamp
  endDate: Date | number;
  streakDays: number;
}

/** Input cho issueVoyage */
export interface IssueVoyageInput {
  learnerAddress: string;
  learnerName: string;
  learnerEmail: string;
  courseName: string;
  completedAt?: Date | number; // optional, default = now
}

// ─── ABI (chỉ các hàm cần thiết) ─────────────────────────────────────────────

const ABI = [
  // Single mint
  {
    name: 'issueGrind',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'learner', type: 'address' },
      { name: 'learnerName', type: 'string' },
      { name: 'learnerEmail', type: 'string' },
      { name: 'periodType', type: 'uint8' },
      { name: 'periodLabel', type: 'string' },
      { name: 'studyHours', type: 'uint256' },
      { name: 'rank', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'issueUnbroken',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'learner', type: 'address' },
      { name: 'learnerName', type: 'string' },
      { name: 'learnerEmail', type: 'string' },
      { name: 'startDate', type: 'uint256' },
      { name: 'endDate', type: 'uint256' },
      { name: 'streakDays', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'issueVoyage',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'learner', type: 'address' },
      { name: 'learnerName', type: 'string' },
      { name: 'learnerEmail', type: 'string' },
      { name: 'courseName', type: 'string' },
      { name: 'completedAt', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  // Event
  {
    name: 'AchievementIssued',
    type: 'event',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'learner', type: 'address', indexed: true },
      { name: 'certType', type: 'uint8', indexed: false },
      { name: 'certId', type: 'string', indexed: false },
      { name: 'learnerName', type: 'string', indexed: false },
    ],
  },
  // View
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
];

const CERT_TYPE_NAMES: Record<CertType, string> = {
  [CertType.THE_GRIND]: 'The Grind',
  [CertType.UNBROKEN]: 'Unbroken',
  [CertType.VOYAGE_COMPLETE]: 'Voyage Complete',
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class DolphintutorAchievementService implements OnModuleInit {
  private provider: JsonRpcProvider;
  private wallet: Wallet;
  private contract: Contract;
  private chainId: number;
  private network: string;

  constructor(
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit() {
    const rpcUrl = 'https://evm-t3.cronos.org';
    const privateKey = config.PRIVATE_KEY_WALLET;
    const contractAddress = '0x5FB42fE0D3982ae26FA34CDc35F94Cb51304d6c3';
    this.chainId = 338;
    this.network = this.chainId === 25 ? 'cronosMainnet' : 'cronosTestnet';

    this.provider = new JsonRpcProvider(rpcUrl);
    this.wallet = new Wallet(privateKey, this.provider);
    this.contract = new Contract(contractAddress, ABI, this.wallet);

    // Kiểm tra kết nối
    try {
      const supply = await this.contract.totalSupply();
      this.logger.log(`✅ Blockchain connected`, {
        Network: this.network,
        Contract: contractAddress,
        TotalSupply: supply.toString(),
      });
    } catch (err) {
      this.logger.error({
        message: `❌ Failed to connect to contract on ${this.network}`,
        trace: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  // ─── Public: Issue The Grind ──────────────────────────────────────────────

  async issueGrind(input: IssueGrindInput): Promise<AchievementIssuedResult> {
    this.logger.log(
      `📤 issueGrind | learner=${input.learnerAddress} | ${input.studyHours}h | ${input.periodLabel}`,
    );

    const tx = await this.contract.issueGrind(
      input.learnerAddress,
      input.learnerName,
      input.learnerEmail,
      input.periodType,
      input.periodLabel,
      BigInt(input.studyHours),
      BigInt(input.rank ?? 0),
    );

    const receipt = await this._waitAndLog(tx, 'issueGrind');
    const event = this._parseEvent(receipt);

    const result: AchievementIssuedResult = {
      ...this._buildBase(
        receipt,
        event,
        input.learnerAddress,
        input.learnerName,
        input.learnerEmail,
      ),
      certType: CertType.THE_GRIND,
      certTypeName: CERT_TYPE_NAMES[CertType.THE_GRIND],
      grind: {
        periodType: input.periodType,
        periodLabel: input.periodLabel,
        studyHours: input.studyHours,
        rank: input.rank ?? 0,
      },
    };

    this.logger.log(
      `✅ issueGrind success | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result;
  }

  // ─── Public: Issue Unbroken ───────────────────────────────────────────────

  async issueUnbroken(
    input: IssueUnbrokenInput,
  ): Promise<AchievementIssuedResult> {
    const startTs = this._toUnixTs(input.startDate);
    const endTs = this._toUnixTs(input.endDate);

    this.logger.log(
      `📤 issueUnbroken | learner=${input.learnerAddress} | ${input.streakDays} days`,
    );

    const tx = await this.contract.issueUnbroken(
      input.learnerAddress,
      input.learnerName,
      input.learnerEmail,
      BigInt(startTs),
      BigInt(endTs),
      BigInt(input.streakDays),
    );

    const receipt = await this._waitAndLog(tx, 'issueUnbroken');
    const event = this._parseEvent(receipt);

    const result: AchievementIssuedResult = {
      ...this._buildBase(
        receipt,
        event,
        input.learnerAddress,
        input.learnerName,
        input.learnerEmail,
      ),
      certType: CertType.UNBROKEN,
      certTypeName: CERT_TYPE_NAMES[CertType.UNBROKEN],
      unbroken: {
        startDate: new Date(startTs * 1000),
        endDate: new Date(endTs * 1000),
        streakDays: input.streakDays,
      },
    };

    this.logger.log(
      `✅ issueUnbroken success | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result;
  }

  // ─── Public: Issue Voyage ─────────────────────────────────────────────────

  async issueVoyage(input: IssueVoyageInput): Promise<AchievementIssuedResult> {
    const completedTs = input.completedAt
      ? this._toUnixTs(input.completedAt)
      : Math.floor(Date.now() / 1000);

    this.logger.log(
      `📤 issueVoyage | learner=${input.learnerAddress} | course="${input.courseName}"`,
    );

    const tx = await this.contract.issueVoyage(
      input.learnerAddress,
      input.learnerName,
      input.learnerEmail,
      input.courseName,
      BigInt(completedTs),
    );

    const receipt = await this._waitAndLog(tx, 'issueVoyage');
    const event = this._parseEvent(receipt);

    const result: AchievementIssuedResult = {
      ...this._buildBase(
        receipt,
        event,
        input.learnerAddress,
        input.learnerName,
        input.learnerEmail,
      ),
      certType: CertType.VOYAGE_COMPLETE,
      certTypeName: CERT_TYPE_NAMES[CertType.VOYAGE_COMPLETE],
      voyage: {
        courseName: input.courseName,
        completedAt: new Date(completedTs * 1000),
      },
    };

    this.logger.log(
      `✅ issueVoyage success | tokenId=${result.tokenId} | certId=${result.certId}`,
    );
    return result;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  /** Chờ transaction confirm + log progress */
  private async _waitAndLog(
    tx: any,
    method: string,
  ): Promise<TransactionReceipt> {
    this.logger.debug(`⏳ ${method} | txHash=${tx.hash} | nonce=${tx.nonce}`);

    const receipt = await tx.wait(1); // chờ 1 confirmation

    if (!receipt)
      throw new Error(`Transaction ${tx.hash} returned null receipt`);
    if (receipt.status === 0)
      throw new Error(`Transaction ${tx.hash} reverted`);

    this.logger.debug(
      `📦 ${method} confirmed | block=${receipt.blockNumber} | gasUsed=${receipt.gasUsed}`,
    );

    return receipt;
  }

  /** Parse AchievementIssued event từ receipt logs */
  private _parseEvent(receipt: TransactionReceipt): {
    tokenId: string;
    certId: string;
    certType: number;
    learner: string;
    learnerName: string;
  } {
    const iface = this.contract.interface;

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({
          topics: (log as Log).topics as string[],
          data: (log as Log).data,
        });
        if (parsed?.name === 'AchievementIssued') {
          return {
            tokenId: parsed.args.tokenId.toString(),
            certId: parsed.args.certId,
            certType: Number(parsed.args.certType),
            learner: parsed.args.learner,
            learnerName: parsed.args.learnerName,
          };
        }
      } catch {
        /* skip non-matching logs */
      }
    }

    throw new Error('AchievementIssued event not found in receipt logs');
  }

  /** Build base result (shared across all 3 cert types) */
  private _buildBase(
    receipt: TransactionReceipt,
    event: ReturnType<typeof this._parseEvent>,
    learnerAddress: string,
    learnerName: string,
    learnerEmail: string,
  ): Omit<
    AchievementIssuedResult,
    'certType' | 'certTypeName' | 'grind' | 'unbroken' | 'voyage'
  > {
    const gasUsed = receipt.gasUsed.toString();
    const effectiveGasPrice = receipt.gasPrice?.toString() ?? '0';
    const txFeeWei = (receipt.gasUsed * (receipt.gasPrice ?? 0n)).toString();
    const txFeeCRO = parseFloat(ethers.formatEther(txFeeWei)).toFixed(6);
    const issuedAt = new Date();

    return {
      // Identifiers
      tokenId: event.tokenId,
      certId: event.certId,

      // Learner
      learnerAddress: learnerAddress.toLowerCase(),
      learnerName,
      learnerEmail,

      // TX
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      blockTimestamp: Math.floor(Date.now() / 1000), // approx; dùng provider.getBlock() nếu cần chính xác
      gasUsed,
      effectiveGasPrice,
      txFeeWei,
      txFeeCRO,

      // Contract
      contractAddress: (this.contract.target as string).toLowerCase(),
      network: this.network,
      chainId: this.chainId,

      // Time
      issuedAt,
      issuedAtIso: issuedAt.toISOString(),
    };
  }

  /** Chuyển Date | number → unix timestamp (seconds) */
  private _toUnixTs(input: Date | number): number {
    if (input instanceof Date) return Math.floor(input.getTime() / 1000);
    if (input > 1e12) return Math.floor(input / 1000); // milliseconds
    return input; // đã là seconds
  }
}
