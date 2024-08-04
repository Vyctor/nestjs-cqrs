import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ContactInfo } from './contact-info.entity';
import { EntityBase } from 'src/common/entities/entity-base';
import { ManagerAssignedEvent } from '../events/manager-assigned/manager-assigned.event';

@Entity()
export class Employee extends EntityBase {
  private _manager?: Employee;
  private _managerId?: number;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  @JoinColumn()
  get manager(): Employee | undefined {
    return this._manager;
  }
  set manager(value: Employee | undefined) {
    this.managerId = value?.managerId;
    this._manager = value;
  }

  @Column({ nullable: true })
  get managerId(): number | undefined {
    return this._managerId;
  }

  set managerId(value: number | undefined) {
    if (value && value !== this._managerId) {
      this.addEvent(new ManagerAssignedEvent(this.id, value));
    }
    this._managerId = value;
  }

  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn()
  contactInfo?: ContactInfo;
}
