import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ManagerAssignedEvent } from './manager-assigned.event';
import { Job, Queue } from 'bull';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { DataSource } from 'typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Logger } from '@nestjs/common';

@EventsHandler(ManagerAssignedEvent)
@Processor('employees')
export class ManagerAssignedSendEmailHandler
  implements IEventHandler<ManagerAssignedEvent>
{
  private readonly logger = new Logger(ManagerAssignedSendEmailHandler.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectQueue('employees')
    private readonly queue: Queue,
  ) {}
  async handle(event: ManagerAssignedEvent) {
    await this.queue.add('manaager-assigned-send-email', event);
  }

  @Process('manaager-assigned-send-email')
  async process(job: Job<ManagerAssignedEvent>) {
    const event = job.data;
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
