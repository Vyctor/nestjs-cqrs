import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entities/meeting.entity';
import { MeetingsController } from './meetings.controller';
import { QueryHandlers } from './queries';
import { ComamandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Meeting])],
  controllers: [MeetingsController],
  providers: [...QueryHandlers, ...ComamandHandlers],
})
export class MeetingsModule {}
