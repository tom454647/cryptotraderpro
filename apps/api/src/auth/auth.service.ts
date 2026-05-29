import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../common/prisma/prisma.service';

/**
 * Admin-side operations against Supabase: needs the service_role key, so it
 * must never be exposed to the browser. Also mirrors users into our own
 * Postgres on `user.created` so all our joins stay local.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  readonly admin: SupabaseClient;

  constructor(
    @Inject(ConfigService) config: ConfigService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {
    const url = config.getOrThrow<string>('SUPABASE_URL');
    const serviceRole = config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.admin = createClient(url, serviceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  /**
   * Verify a Supabase user actually exists on the auth side — used by
   * Sprint 2.5's terms-acceptance flow to defend against a stale local
   * mirror after a Supabase deletion the webhook missed.
   */
  async getSupabaseUser(authProviderId: string): Promise<{ id: string; email?: string } | null> {
    const { data, error } = await this.admin.auth.admin.getUserById(authProviderId);
    if (error || !data.user) return null;
    return { id: data.user.id, email: data.user.email };
  }

  /**
   * Look up the local Postgres mirror for a Supabase user id.
   * Returns null if the webhook hasn't created the row yet (first-signup race).
   */
  async findLocalUser(authProviderId: string) {
    return this.prisma.user.findUnique({
      where: { authProviderId },
      select: {
        id: true,
        email: true,
        acceptedTermsAt: true,
        acceptedTermsVersion: true,
        taxResidency: true,
        baseCurrency: true,
      },
    });
  }

  /**
   * First-signup fallback when the Supabase webhook hasn't fired yet.
   * Idempotent — only creates if no row exists for this auth provider id.
   */
  async ensureLocalUser(input: {
    authProviderId: string;
    email: string;
  }): Promise<void> {
    await this.prisma.user.upsert({
      where: { authProviderId: input.authProviderId },
      create: {
        authProviderId: input.authProviderId,
        email: input.email,
      },
      update: {},
    });
  }

  /**
   * Mirror a Supabase user into our own User row. Idempotent — webhook
   * delivery is at-least-once, so we tolerate replays.
   */
  async mirrorUser(input: {
    authProviderId: string;
    email: string;
  }): Promise<void> {
    await this.prisma.user.upsert({
      where: { authProviderId: input.authProviderId },
      create: {
        authProviderId: input.authProviderId,
        email: input.email,
      },
      update: {
        email: input.email,
      },
    });
    this.logger.log(`Mirrored user ${input.authProviderId}`);
  }

  /**
   * Hard-delete a user (Supabase + our DB) on a verified user.deleted webhook.
   * Cascading FKs in the Prisma schema remove wallets/exchanges/positions/etc.
   */
  async deleteUser(authProviderId: string): Promise<void> {
    await this.prisma.user.deleteMany({ where: { authProviderId } });
    this.logger.log(`Deleted local mirror of user ${authProviderId}`);
  }

  /**
   * Record that the user accepted our Terms (with version, for audit).
   * Called by the /me/accept-terms endpoint after the user clicks the modal.
   */
  async recordTermsAcceptance(input: {
    authProviderId: string;
    version: string;
  }): Promise<void> {
    await this.prisma.user.update({
      where: { authProviderId: input.authProviderId },
      data: {
        acceptedTermsAt: new Date(),
        acceptedTermsVersion: input.version,
      },
    });
  }
}
