import { DepartmentInput } from 'src/app/pages/internal/departments/models/department';
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

function parseDepartment(context: RequestContext, ignoreId?: number): DepartmentInput {
  const data = body(context);
  const name = requiredText(data, 'name', 60);
  if (context.db.isDepartmentNameTaken(name, ignoreId)) {
    fail(409, 'departmentTaken', 'Já existe um departamento com esse nome.', 'name');
  }

  const managerId = optionalId(data, 'managerId');
  if (managerId !== null && !context.db.findEmployee(managerId)) {
    fail(422, 'invalid', 'Responsável inexistente.', 'managerId');
  }

  return { name, description: requiredText(data, 'description', 160), managerId };
}

export const DEPARTMENT_ROUTES: Route[] = [
  {
    method: 'GET',
    pattern: /^\/api\/departments$/,
    handler: ({ db, query }) =>
      ok(createTableView(db.departmentRows(), listFilter(query), ['name', 'managerName', 'description'])),
  },
  {
    method: 'GET',
    pattern: /^\/api\/departments\/options$/,
    handler: ({ db }) =>
      ok<Option[]>(
        db
          .getDepartments()
          .map(({ id, name }) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name))
      ),
  },
  {
    method: 'GET',
    pattern: /^\/api\/departments\/name-availability$/,
    handler: ({ db, query }) => {
      const ignoreId = Number(query.get('ignoreId')) || undefined;
      return ok({ available: !db.isDepartmentNameTaken(query.get('name') ?? '', ignoreId) });
    },
  },
  {
    method: 'POST',
    pattern: /^\/api\/departments$/,
    handler: (context) => created(context.db.insertDepartment(parseDepartment(context))),
  },
  {
    method: 'PUT',
    pattern: /^\/api\/departments\/(\d+)$/,
    handler: (context) => {
      const id = idParam(context);
      if (!context.db.findDepartment(id)) fail(404, 'notFound', 'Departamento não encontrado.');
      return ok(context.db.updateDepartment(id, parseDepartment(context, id)));
    },
  },
  {
    method: 'DELETE',
    pattern: /^\/api\/departments\/(\d+)$/,
    handler: (context) => {
      const id = idParam(context);
      if (!context.db.findDepartment(id)) fail(404, 'notFound', 'Departamento não encontrado.');
      context.db.deleteDepartment(id);
      return noContent();
    },
  },
];
