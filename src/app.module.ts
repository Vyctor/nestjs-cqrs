import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module';
import { ReportsModule } from './reports/reports.module';
import { MeetingsModule } from './meetings/meetings.module';
import { TasksModule } from './tasks/tasks.module';
import { BullModule } from '@nestjs/bull';
import { AppConfigModule } from './app-config/app-config.module';
import { EnvironmentService } from './app-config/environment.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => ({
        redis: environmentService.redisUrl,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 1000,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
    EmployeesModule,
    ReportsModule,
    MeetingsModule,
    TasksModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
