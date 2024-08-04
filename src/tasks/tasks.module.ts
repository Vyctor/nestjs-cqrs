import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Task])],
  providers: [...QueryHandlers, ...CommandHandlers],
  controllers: [TasksController],
})
export class TasksModule {}
