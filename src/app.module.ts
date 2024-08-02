import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from './entities/contact-info.entity';
import { Employee } from './entities/employee.entity';
import { Meeting } from './entities/meeting.entity';
import { Task } from './entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([Employee, Task, ContactInfo, Meeting]),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
