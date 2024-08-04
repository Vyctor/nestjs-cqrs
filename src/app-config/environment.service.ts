import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly config: ConfigService) {}

  get redisUrl(): string {
    return this.config.get<string>('REDIS_URL');
  }
}
