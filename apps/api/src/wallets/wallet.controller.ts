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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';

/**
 * /api/wallets — watch-only wallet management. Behind the global AuthGuard.
 * The Supabase JWT sub identifies the user; the service resolves it to the
 * local User.id.
 */
@Controller('wallets')
export class WalletController {
  constructor(@Inject(WalletService) private readonly wallets: WalletService) {}

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
   * Manual sync trigger. In 3.3 this enqueues a BullMQ wallet-sync job;
   * for now it validates ownership and returns accepted so the frontend
   * flow can be wired up before the connector lands.
   */
  @Post(':id/sync')
  @HttpCode(HttpStatus.ACCEPTED)
  async sync(@CurrentUser('sub') sub: string, @Param('id') id: string) {
    const walletId = await this.wallets.assertOwned(sub, id);
    return { walletId, status: 'sync_queued' };
  }
}
