import { Injectable, Inject, NotImplementedException } from '@nestjs/common';
import { Chain } from '@prisma/client';
import { AlchemyService } from './alchemy.service';
import { isEvmChain, type RawBalance } from './connector.types';

/**
 * Single entry point for "give me the balances of this address on this chain".
 *
 * Routes EVM chains to Alchemy. Non-EVM chains (Solana) throw until their
 * connector lands — Sprint 4 wires Helius in here behind the same method,
 * so callers (PositionService) never branch on chain themselves.
 */
@Injectable()
export class ProviderRouter {
  constructor(@Inject(AlchemyService) private readonly alchemy: AlchemyService) {}

  async getBalances(chain: Chain, address: string): Promise<RawBalance[]> {
    if (isEvmChain(chain)) {
      return this.alchemy.getBalances(chain, address);
    }
    if (chain === Chain.SOLANA) {
      throw new NotImplementedException('Solana support lands in Sprint 4 (Helius).');
    }
    throw new NotImplementedException(`No provider wired for ${chain} yet.`);
  }
}
