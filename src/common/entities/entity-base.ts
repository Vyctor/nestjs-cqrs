import { AfterLoad } from 'typeorm';

export class EntityBase {
  private events: unknown[] = [];

  addEvent(event: unknown): void {
    this.events.push(event);
  }

  clear(): void {
    this.events = [];
  }

  getEvents(): unknown[] {
    return this.events;
  }

  @AfterLoad()
  clearEventsAfterLoad(): void {
    this.clear();
  }
}
