export class ManagerAssignedEvent {
  constructor(
    public readonly employeeId: number,
    public readonly managerId: number,
  ) {}
}
