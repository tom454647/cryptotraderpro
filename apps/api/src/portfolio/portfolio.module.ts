import { Module } from '@nestjs/common';
import { ConnectorsModule } from '../connectors/connectors.module';
import { PricesModule } from '../prices/prices.module';
import { PortfolioController } from './portfolio.controller';
import { PositionService } from './position.service';

/**
 * Portfolio aggregation. Owns PositionService (sync + read) and the
 * /api/portfolio controller. WalletModule imports this to reach
 * PositionService for its sync endpoint — the dependency points one way
 * (wallets → portfolio), so there is no cycle.
 */
@Module({
  imports: [ConnectorsModule, PricesModule],
  controllers: [PortfolioController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PortfolioModule {}
