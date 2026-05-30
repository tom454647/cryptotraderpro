import { Module } from '@nestjs/common';
import { CoinGeckoService } from './coingecko.service';

/** Market-data pricing. RedisService is global, so nothing else to import. */
@Module({
  providers: [CoinGeckoService],
  exports: [CoinGeckoService],
})
export class PricesModule {}
