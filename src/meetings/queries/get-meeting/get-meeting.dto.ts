import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetMeetingDto {
  @Expose()
  id: number;
  @Expose()
  zoomUrl: string;
  @Expose()
  attendees: GetMeetingAttendeesDto[];
}

@Exclude()
export class GetMeetingAttendeesDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
}
