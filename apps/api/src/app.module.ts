import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule, SentryGlobalFilter } from '@sentry/nestjs/setup';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallets/wallet.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    // SentryModule first — wires Sentry's NestJS instrumentation into the
    // DI container so spans + errors are auto-captured. Sentry.init() itself
    // still runs in instrument.ts (must happen before any NestJS import).
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    RedisModule,
    HealthModule,
    AuthModule,
    PortfolioModule,
    WalletModule,
  ],
  providers: [
    // Replaces the deprecated `setupNestErrorHandler` in main.ts. Catches
    // unhandled exceptions thrown in handlers and forwards to Sentry, then
    // falls through to NestJS' default exception filter.
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule {}
