import { EmployeeInput } from 'src/app/pages/internal/employees/models/employee';
import { createTableView } from 'src/app/utils/table-view';
import { Option } from '../../api.models';
import {
  RequestContext,
  Route,
  body,
  created,
  fail,
  idParam,
  listFilter,
  noContent,
  ok,
  optionalId,
  requiredText,
} from '../http-utils';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmployee(context: RequestContext, ignoreId?: number): EmployeeInput {
  const data = body(context);
  const email = requiredText(data, 'email', 120).toLocaleLowerCase();
  if (!EMAIL_PATTERN.test(email)) fail(422, 'email', 'E-mail inválido.', 'email');
  if (context.db.isEmailTaken(email, ignoreId)) {
    fail(409, 'emailTaken', 'Este e-mail já está em uso.', 'email');
  }

  const departmentId = optionalId(data, 'departmentId');
  if (departmentId !== null && !context.db.findDepartment(departmentId)) {
    fail(422, 'invalid', 'Departamento inexistente.', 'departmentId');
  }

  return {
    name: requiredText(data, 'name', 80),
    email,
    role: requiredText(data, 'role', 60),
    departmentId,
  };
}

export const EMPLOYEE_ROUTES: Route[] = [
  {
    method: 'GET',
    pattern: /^\/api\/employees$/,
    handler: ({ db, query }) =>
      ok(createTableView(db.employeeRows(), listFilter(query), ['name', 'email', 'role', 'department'])),
  },
  {
    method: 'GET',
    pattern: /^\/api\/employees\/options$/,
    handler: ({ db }) =>
      ok<Option[]>(
        db
          .getEmployees()
          .map(({ id, name }) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name))
      ),
  },
  {
    method: 'GET',
    pattern: /^\/api\/employees\/email-availability$/,
    handler: ({ db, query }) => {
      const ignoreId = Number(query.get('ignoreId')) || undefined;
      return ok({ available: !db.isEmailTaken(query.get('email') ?? '', ignoreId) });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/employees$/,
    handler: (context) => created(context.db.insertEmployee(parseEmployee(context))),
  },
  {
    method: 'PUT',
    pattern: /^\/api\/employees\/(\d+)$/,
    handler: (context) => {
      const id = idParam(context);
      if (!context.db.findEmployee(id)) fail(404, 'notFound', 'Funcionário não encontrado.');
      return ok(context.db.updateEmployee(id, parseEmployee(context, id)));
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/employees\/(\d+)$/,
    handler: (context) => {
      const id = idParam(context);
      if (!context.db.findEmployee(id)) fail(404, 'notFound', 'Funcionário não encontrado.');
      context.db.deleteEmployee(id);
      return noContent();
    },
  },
];
