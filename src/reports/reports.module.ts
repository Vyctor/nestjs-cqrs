import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { QueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  providers: [...QueryHandlers],

  controllers: [ReportsController],
})
export class ReportsModule {}
