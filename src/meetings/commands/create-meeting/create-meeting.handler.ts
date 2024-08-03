import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMeetingCommand } from './create-meeting.command';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateMeetingCommand)
export class CreateMeetingHandler
  implements ICommandHandler<CreateMeetingCommand, number>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}
  async execute(command: CreateMeetingCommand): Promise<number> {
    return await this.datasource.transaction(async (db) => {
      const attendees = await db.find(Employee, {
        where: {
          id: In(command.attendees),
        },
      });

      const hasInvalidAttendees = command.attendees.find(
        (a) => !attendees.some((e) => e.id === a),
      );

      if (hasInvalidAttendees) {
        throw new NotFoundException('Invalid attendees');
      }

      const meeting = db.create(Meeting, {
        attendees,
        zoomUrl: `https://zoom.us/j/${randomUUID()}`,
      });

      await db.save(meeting);

      return meeting.id;
    });
  }
}
