import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvironmentService } from './environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('local', 'development', 'production'),
        REDIS_URL: Joi.string().required(),
      }),
    }),
  ],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class AppConfigModule {}
