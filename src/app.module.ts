import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesModule } from './employees/employees.module';
import { ReportsModule } from './reports/reports.module';
import { MeetingsModule } from './meetings/meetings.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
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
