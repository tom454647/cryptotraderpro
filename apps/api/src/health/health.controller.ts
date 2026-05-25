import { Controller, Get, HttpCode } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

interface HealthResponse {
  status: 'ok' | 'degraded';
  db: 'up' | 'down';
  redis: 'up' | 'down';
  timestamp: string;
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @HttpCode(200)
  async check(): Promise<HealthResponse> {
    const [dbUp, redisUp] = await Promise.all([this.prisma.ping(), this.redis.ping()]);

    return {
      status: dbUp && redisUp ? 'ok' : 'degraded',
      db: dbUp ? 'up' : 'down',
      redis: redisUp ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    };
  }
}
