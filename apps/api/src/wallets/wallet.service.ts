import {
  Injectable,
  Inject,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Chain } from '@prisma/client';
import { isAddress, getAddress } from 'viem';
import { PrismaService } from '../common/prisma/prisma.service';
import type { CreateWalletDto } from './dto/create-wallet.dto';

const EVM_CHAINS: ReadonlySet<Chain> = new Set([
  Chain.ETHEREUM,
  Chain.BSC,
  Chain.POLYGON,
  Chain.ARBITRUM,
  Chain.OPTIMISM,
  Chain.BASE,
  Chain.AVALANCHE,
]);

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /**
   * Resolve our local User.id from the Supabase auth-provider id (JWT sub).
   * Wallets reference User.id, not the Supabase id. Throws if the local
   * mirror is missing (webhook race) — the caller should retry.
   */
  private async resolveUserId(authProviderId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { authProviderId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User profile not found yet — try again in a moment');
    }
    return user.id;
  }

  /**
   * Normalise + validate the address for its chain. EVM addresses are
   * checksum-normalised via viem; Solana validation lands in Sprint 4.
   */
  private normaliseAddress(address: string, chain: Chain): string {
    const trimmed = address.trim();
    if (EVM_CHAINS.has(chain)) {
      if (!isAddress(trimmed)) {
        throw new BadRequestException(`"${trimmed}" is not a valid ${chain} address`);
      }
      return getAddress(trimmed); // checksum form
    }
    // Non-EVM (Solana) — minimal sanity check until Sprint 4 adds proper validation.
    if (trimmed.length < 32 || trimmed.length > 44) {
      throw new BadRequestException(`"${trimmed}" is not a valid ${chain} address`);
    }
    return trimmed;
  }

  async create(authProviderId: string, dto: CreateWalletDto) {
    const userId = await this.resolveUserId(authProviderId);
    const address = this.normaliseAddress(dto.address, dto.chain);

    const existing = await this.prisma.wallet.findUnique({
      where: { userId_address_chain: { userId, address, chain: dto.chain } },
    });
    if (existing) {
      throw new ConflictException('You already track this wallet on this chain');
    }

    const wallet = await this.prisma.wallet.create({
      data: {
        userId,
        address,
        chain: dto.chain,
        label: dto.label?.trim() || null,
        isWatchOnly: true, // INVARIANT — never settable by the client
      },
    });
    this.logger.log(`Wallet added: ${dto.chain} ${address.slice(0, 10)}… for user ${userId}`);
    return wallet;
  }

  async findAll(authProviderId: string) {
    const userId = await this.resolveUserId(authProviderId);
    return this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        address: true,
        chain: true,
        label: true,
        isWatchOnly: true,
        lastSync: true,
        createdAt: true,
      },
    });
  }

  async remove(authProviderId: string, walletId: string): Promise<void> {
    const userId = await this.resolveUserId(authProviderId);
    // deleteMany scoped to userId so a user can never delete someone else's wallet.
    const res = await this.prisma.wallet.deleteMany({ where: { id: walletId, userId } });
    if (res.count === 0) {
      throw new NotFoundException('Wallet not found');
    }
  }

  /** Ownership guard for the sync endpoint; full sync logic lands in 3.3. */
  async assertOwned(authProviderId: string, walletId: string): Promise<string> {
    const userId = await this.resolveUserId(authProviderId);
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId },
      select: { id: true },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet.id;
  }
}
