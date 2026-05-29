import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';

interface SupabaseJWTPayload extends JWTPayload {
  sub: string;            // Supabase user id
  email?: string;
  role?: 'authenticated' | 'anon' | 'service_role';
  aud: string;            // "authenticated"
}

export interface RequestWithUser extends Request {
  user: SupabaseJWTPayload;
}

/**
 * Verifies Supabase-issued JWTs against the project's JWKS endpoint.
 *
 * Supabase switched to asymmetric JWT signing keys on 2025-10-01 — our project
 * is on the new system. The public keys live behind the JWKS URL; `jose` fetches
 * and caches them, so token verification is local and fast (~µs) after the first
 * cache fill.
 *
 * Routes can opt out with @Public(). Everything else requires a valid JWT.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;
  private readonly issuer: string;

  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(Reflector) private readonly reflector: Reflector,
  ) {
    const jwksUrl = this.config.getOrThrow<string>('SUPABASE_JWKS_URL');
    const supabaseUrl = this.config.getOrThrow<string>('SUPABASE_URL');
    this.issuer = `${supabaseUrl}/auth/v1`;
    this.jwks = createRemoteJWKSet(new URL(jwksUrl), {
      cacheMaxAge: 10 * 60 * 1000,    // 10 minutes
      cooldownDuration: 30 * 1000,    // 30s after a refresh
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    try {
      const { payload } = await jwtVerify<SupabaseJWTPayload>(token, this.jwks, {
        issuer: this.issuer,
        audience: 'authenticated',
      });
      req.user = payload;
      return true;
    } catch (err) {
      this.logger.debug(`JWT verification failed: ${(err as Error).message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(req: Request): string | null {
    const header = req.headers.authorization;
    if (!header) return null;
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
    return token;
  }
}
