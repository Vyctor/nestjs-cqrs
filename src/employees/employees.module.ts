import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { ComamandHandlers } from './commands';
import { EventHandlers } from './events';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Employee, ContactInfo]),
    CommonModule,
  ],
  providers: [...QueryHandlers, ...ComamandHandlers, ...EventHandlers],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
