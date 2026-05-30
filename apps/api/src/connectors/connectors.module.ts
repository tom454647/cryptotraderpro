import { Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { ProviderRouter } from './provider-router.service';

/**
 * On-chain read-only connectors. Exposes ProviderRouter as the single facade;
 * concrete providers (Alchemy now, Helius/Zerion in Sprint 4) stay internal.
 */
@Module({
  providers: [AlchemyService, ProviderRouter],
  exports: [ProviderRouter],
})
export class ConnectorsModule {}
