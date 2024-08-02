import { AssignManagerHandler } from './assign-manager/assign-manager.handler';
import { CreateEmployeeHandler } from './create-employee/create-employeea.handler';
import { UpdateEmployeeHandler } from './update-employee/update-employee.handler';

export const ComamandHandlers = [
  CreateEmployeeHandler,
  UpdateEmployeeHandler,
  AssignManagerHandler,
];
