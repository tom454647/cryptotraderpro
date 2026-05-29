import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Public } from './public.decorator';

interface SupabaseUserPayload {
  id: string;
  email?: string;
}

interface SupabaseWebhookBody {
  type: string;
  table?: string;
  record?: SupabaseUserPayload;
  old_record?: SupabaseUserPayload;
}

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) {}

  /**
   * Webhook from Supabase Auth — receives user.created, user.updated,
   * user.deleted. We mirror into our own Postgres so joins stay local.
   *
   * Signed with HMAC-SHA256 of the raw body using SUPABASE_WEBHOOK_SECRET.
   * The secret is set on the Supabase side when we create the webhook.
   */
  @Public()
  @Post('webhooks/supabase')
  @HttpCode(HttpStatus.OK)
  async supabaseWebhook(
    @Headers('x-supabase-signature') signature: string | undefined,
    @Body() body: SupabaseWebhookBody,
  ): Promise<{ ok: true }> {
    const secret = this.config.get<string>('SUPABASE_WEBHOOK_SECRET');
    if (secret) {
      this.verifySignature(JSON.stringify(body), signature, secret);
    } else {
      // Webhook secret not yet configured (Sprint 2.5 sets it up). Allow in
      // dev, but log loudly so we don't ship to prod without it.
      this.logger.warn('SUPABASE_WEBHOOK_SECRET is not set — accepting unsigned webhook');
    }

    switch (body.type) {
      case 'INSERT':
      case 'UPDATE':
        if (body.record?.id && body.record.email) {
          await this.authService.mirrorUser({
            authProviderId: body.record.id,
            email: body.record.email,
          });
        }
        break;
      case 'DELETE':
        if (body.old_record?.id) {
          await this.authService.deleteUser(body.old_record.id);
        }
        break;
      default:
        this.logger.debug(`Unhandled webhook type: ${body.type}`);
    }

    return { ok: true };
  }

  /**
   * Returns the currently-authenticated user — JWT payload plus the mirrored
   * row from our Postgres (so the frontend knows whether terms have been
   * accepted and which tier the user is on).
   *
   * Behind the global AuthGuard — a 401 means "not logged in" not "no such user".
   * If the local mirror is missing (webhook race on first sign-up), returns
   * the JWT alone with `mirror: null` so the frontend can wait + retry.
   */
  @Get('me')
  async me(@CurrentUser('sub') sub: string, @CurrentUser() jwt: unknown) {
    const mirror = await this.authService.findLocalUser(sub);
    return {
      jwt,
      mirror: mirror
        ? {
            id: mirror.id,
            email: mirror.email,
            acceptedTermsAt: mirror.acceptedTermsAt,
            acceptedTermsVersion: mirror.acceptedTermsVersion,
            taxResidency: mirror.taxResidency,
            baseCurrency: mirror.baseCurrency,
          }
        : null,
    };
  }

  /**
   * User clicks "I accept the terms" in the post-signup modal — record version.
   */
  @Post('me/accept-terms')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptTerms(
    @CurrentUser('sub') sub: string,
    @Body() body: { version: string },
  ): Promise<void> {
    if (!body?.version) {
      throw new HttpException('version is required', HttpStatus.BAD_REQUEST);
    }
    await this.authService.recordTermsAcceptance({
      authProviderId: sub,
      version: body.version,
    });
  }

  private verifySignature(rawBody: string, header: string | undefined, secret: string): void {
    if (!header) {
      throw new HttpException('Missing webhook signature', HttpStatus.UNAUTHORIZED);
    }
    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const given = Buffer.from(header, 'utf8');
    const want = Buffer.from(expected, 'utf8');
    if (given.length !== want.length || !timingSafeEqual(given, want)) {
      throw new HttpException('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
    }
  }
}
