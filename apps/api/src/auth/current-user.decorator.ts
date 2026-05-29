import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { RequestWithUser } from './auth.guard';

/**
 * Injects the authenticated Supabase user payload into a controller handler.
 * Throws (via the guard) if no user is on the request — only valid behind AuthGuard.
 *
 * Usage:
 *   @Get('me')
 *   me(@CurrentUser() user: SupabaseJWTPayload) { return user; }
 *
 *   @Get('me/sub')
 *   sub(@CurrentUser('sub') id: string) { return id; }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    if (!req.user) return undefined;
    return data ? req.user[data as keyof typeof req.user] : req.user;
  },
);
