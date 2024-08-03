import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMeetingQuery } from './get-meeting.query';
import { GetMeetingDto } from './get-meeting.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Meeting } from 'src/meetings/entities/meeting.entity';
import { plainToClass } from 'class-transformer';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetMeetingQuery)
export class GetMeetingHandler
  implements IQueryHandler<GetMeetingQuery, GetMeetingDto>
{
  constructor(
    @InjectDataSource()
    private readonly datasource: DataSource,
  ) {}

  async execute(query: GetMeetingQuery): Promise<GetMeetingDto> {
    const data = await this.datasource.manager.findOne(Meeting, {
      where: {
        id: query.id,
      },
      relations: ['attendees'],
      select: {
        id: true,
        zoomUrl: true,
        attendees: {
          id: true,
          name: true,
        },
      },
    });
    if (!data) throw new NotFoundException(`Meeting ${query.id} not found`);

    return plainToClass(GetMeetingDto, data);
  }
}
