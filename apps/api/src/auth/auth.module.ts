import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

/**
 * Auth wiring:
 * - AuthGuard registered globally via APP_GUARD — every route requires a
 *   valid Supabase JWT unless marked @Public().
 * - AuthService holds the service_role Supabase admin client and the
 *   user-mirror logic.
 * - AuthController owns /webhooks/supabase, /me, /me/accept-terms.
 */
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
