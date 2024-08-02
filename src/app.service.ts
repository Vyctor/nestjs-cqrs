import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Employee } from './employees/entities/employee.entity';
import { ContactInfo } from './employees/entities/contact-info.entity';
import { Meeting } from './meetings/entities/meeting.entity';
import { Task } from './tasks/entities/task.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    await this.dataSource.transaction(async (db) => {
      const contactInfo = db.create(ContactInfo, {
        email: 'ceo@acme.com',
      });

      await db.save(contactInfo);

      const ceo = db.create(Employee, {
        name: 'Mr. CEO',
        contactInfo,
      });

      await db.save(ceo);

      const manager = db.create(Employee, {
        name: 'Manager',
        manager: ceo,
        contactInfo: db.create(ContactInfo, {}),
      });

      await db.save(manager);

      const task1 = db.create(Task, {
        name: 'Hire People',
        assignee: manager,
      });

      const task2 = db.create(Task, {
        name: 'Present to CEO',
        assignee: manager,
      });

      await db.save([task1, task2]);

      const meeting = db.create(Meeting, {
        attendees: [ceo, manager],
        zoomUrl: 'https://zoom.us/1234',
      });

      await db.save(meeting);

      meeting.attendees.push(manager);
      await db.save(meeting);
    });
  }
}
