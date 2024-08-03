import { IsArray, IsNumber } from 'class-validator';

export class CreateMeetingDto {
  @IsArray()
  @IsNumber({}, { each: true })
  attendees: number[];
}
