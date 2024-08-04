import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ManagerAssignedEvent } from './manager-assigned.event';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';

@EventsHandler(ManagerAssignedEvent)
export class ManagerAssignedSendEmailHandler
  implements IEventHandler<ManagerAssignedEvent>
{
  private readonly logger = new Logger(ManagerAssignedSendEmailHandler.name);
  constructor(private readonly dataSource: DataSource) {}
  async handle(event: ManagerAssignedEvent) {
    const manager = await this.dataSource.manager.findOne(Employee, {
      where: { id: event.managerId },
      relations: ['contactInfo'],
    });

    if (!manager.contactInfo.email) {
      this.logger.error(`Manager with id ${event.managerId} has no email`);
      return;
    }

    const employee = await this.dataSource.manager.findOne(Employee, {
      where: { id: event.employeeId },
    });

    this.logger.log(
      `Send email to ${manager.contactInfo.email}, saying that ${employee.name} is now their direct report`,
    );
  }
}
