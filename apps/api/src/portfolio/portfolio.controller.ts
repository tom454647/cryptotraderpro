import { Controller, Get, Inject } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { PositionService } from './position.service';

/**
 * /api/portfolio — read-only aggregated EUR view across the user's wallets.
 * Behind the global AuthGuard. Pure read; no balance is fetched here (that
 * happens on wallet sync) — this just aggregates already-stored positions.
 */
@Controller('portfolio')
export class PortfolioController {
  constructor(@Inject(PositionService) private readonly positions: PositionService) {}

  @Get()
  get(@CurrentUser('sub') sub: string) {
    return this.positions.getPortfolio(sub);
  }
}
