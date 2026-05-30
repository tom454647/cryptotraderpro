import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { PositionService } from '../portfolio/position.service';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

/**
 * /api/wallets — watch-only wallet management. Behind the global AuthGuard.
 * The Supabase JWT sub identifies the user; the service resolves it to the
 * local User.id.
 */
@Controller('wallets')
export class WalletController {
  constructor(
    @Inject(WalletService) private readonly wallets: WalletService,
    @Inject(PositionService) private readonly positions: PositionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@CurrentUser('sub') sub: string, @Body() dto: CreateWalletDto) {
    return this.wallets.create(sub, dto);
  }

  @Get()
  findAll(@CurrentUser('sub') sub: string) {
    return this.wallets.findAll(sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@CurrentUser('sub') sub: string, @Param('id') id: string): Promise<void> {
    await this.wallets.remove(sub, id);
  }

  /**
   * Manual sync trigger — reads the wallet's on-chain balances, prices them,
   * and replaces its stored positions. Runs synchronously for now; a later
   * 3.x can move this behind a BullMQ job without changing the contract.
   * Returns 200 with the sync summary.
   */
  @Post(':id/sync')
  @HttpCode(HttpStatus.OK)
  async sync(@CurrentUser('sub') sub: string, @Param('id') id: string) {
    return this.positions.syncWallet(sub, id);
  }
}
