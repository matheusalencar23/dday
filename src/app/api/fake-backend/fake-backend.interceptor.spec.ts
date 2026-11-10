import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { EmployeeRow } from 'src/app/pages/internal/employees/models/employee';
import { PaymentListRow } from 'src/app/pages/internal/payment/models/payment';
import { TableView } from 'src/app/utils/table-view';
import { FakeBackendConfig } from './fake-backend.config';
import { fakeBackendInterceptor } from './fake-backend.interceptor';
import { FakeDatabase } from './fake-database';

const MAX_LATENCY_MS = 1500;
const TIAGO_ID = 878; // responsável pelo departamento Legal
const LEGAL_ID = 689;

interface Result<T> {
  response?: HttpResponse<T>;
  error?: HttpErrorResponse;
}

describe('fakeBackendInterceptor', () => {
  let http: HttpClient;
  let db: FakeDatabase;

  /** Executa a requisição e avança o relógio além da latência simulada. */
  function run<T>(request: Observable<HttpResponse<T>>): Result<T> {
    const result: Result<T> = {};
    request.subscribe({
      next: (response) => (result.response = response),
      error: (error: HttpErrorResponse) => (result.error = error),
    });
    tick(MAX_LATENCY_MS);
    return result;
  }

  const validEmployee = {
    name: 'Nova Pessoa',
    email: 'nova.pessoa@example.test',
    role: 'QA Analyst',
    departmentId: 12,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([fakeBackendInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    db = TestBed.inject(FakeDatabase);
    spyOn(console, 'debug'); // silencia o log de requisições
  });

  it('deixa passar requisições fora de /api', () => {
    const controller = TestBed.inject(HttpTestingController);
    http.get('/assets/i18n/pt.json').subscribe();
    controller.expectOne('/assets/i18n/pt.json').flush({});
    controller.verify();
  });

  it('pagina, filtra e ordena listagens no servidor', fakeAsync(() => {
    const { response } = run(
      http.get<TableView<EmployeeRow>>('/api/employees', {
        observe: 'response',
        params: { search: 'developer', sortBy: 'name', order: 'desc', page: 1, pageSize: 2 },
      })
    );

    expect(response?.status).toBe(200);
    const view = response!.body!;
    expect(view.data.length).toBe(2);
    expect(view.total).toBeGreaterThan(2);
    expect(view.data[0].name.localeCompare(view.data[1].name)).toBeGreaterThan(0);
    view.data.forEach((row) => expect(row.role.toLowerCase()).toContain('developer'));
  }));

  it('serializa a resposta como JSON: datas chegam como texto ISO', fakeAsync(() => {
    const { response } = run(
      http.get<TableView<PaymentListRow>>('/api/payments', {
        observe: 'response',
        params: { pageSize: 1 },
      })
    );

    const date = response!.body!.data[0].date as unknown;
    expect(typeof date).toBe('string');
    expect(new Date(date as string).toISOString()).toBe(date as string);
  }));

  it('não expõe referências do banco: alterar a resposta não altera os dados', fakeAsync(() => {
    const { response } = run(
      http.get<TableView<EmployeeRow>>('/api/employees', { observe: 'response' })
    );
    const first = response!.body!.data[0];
    first.name = 'Alterado';

    expect(db.findEmployee(first.id)?.name).not.toBe('Alterado');
  }));

  it('cria um funcionário (201) com e-mail normalizado', fakeAsync(() => {
    const { response } = run(
      http.post('/api/employees', { ...validEmployee, email: ' NOVA.Pessoa@Example.test ' }, {
        observe: 'response',
      })
    );

    expect(response?.status).toBe(201);
    expect(response?.body).toEqual(
      jasmine.objectContaining({ email: 'nova.pessoa@example.test', name: 'Nova Pessoa' })
    );
    expect(db.isEmailTaken('nova.pessoa@example.test')).toBeTrue();
  }));

  it('responde 409 com o campo quando o e-mail já existe', fakeAsync(() => {
    const { error } = run(
      http.post('/api/employees', { ...validEmployee, email: 'ana.costa@example.test' }, {
        observe: 'response',
      })
    );

    expect(error?.status).toBe(409);
    expect(error?.error).toEqual(jasmine.objectContaining({ code: 'emailTaken', field: 'email' }));
  }));

  it('responde 422 para dados inválidos', fakeAsync(() => {
    const missingName = run(
      http.post('/api/employees', { ...validEmployee, name: '   ' }, { observe: 'response' })
    );
    expect(missingName.error?.status).toBe(422);
    expect(missingName.error?.error).toEqual(
      jasmine.objectContaining({ code: 'required', field: 'name' })
    );

    const unknownDepartment = run(
      http.post('/api/employees', { ...validEmployee, departmentId: 99999 }, { observe: 'response' })
    );
    expect(unknownDepartment.error?.status).toBe(422);
    expect(unknownDepartment.error?.error).toEqual(
      jasmine.objectContaining({ field: 'departmentId' })
    );
  }));

  it('responde 404 ao editar um registro inexistente', fakeAsync(() => {
    const { error } = run(http.put('/api/employees/99999', validEmployee, { observe: 'response' }));
    expect(error?.status).toBe(404);
  }));

  it('remove (204) aplicando as regras de cascata', fakeAsync(() => {
    const { response } = run(http.delete(`/api/employees/${TIAGO_ID}`, { observe: 'response' }));

    expect(response?.status).toBe(204);
    expect(db.findEmployee(TIAGO_ID)).toBeUndefined();
    expect(db.findDepartment(LEGAL_ID)?.managerId).toBeNull();
  }));

  it('informa a disponibilidade de e-mail ignorando o próprio registro', fakeAsync(() => {
    const taken = run(
      http.get('/api/employees/email-availability', {
        observe: 'response',
        params: { email: 'ana.costa@example.test' },
      })
    );
    const own = run(
      http.get('/api/employees/email-availability', {
        observe: 'response',
        params: { email: 'ana.costa@example.test', ignoreId: 316 },
      })
    );

    expect(taken.response?.body).toEqual({ available: false });
    expect(own.response?.body).toEqual({ available: true });
  }));

  it('responde 404 para rotas desconhecidas', fakeAsync(() => {
    const { error } = run(http.get('/api/unknown', { observe: 'response' }));
    expect(error?.status).toBe(404);
    expect(error?.error).toEqual(jasmine.objectContaining({ code: 'routeNotFound' }));
  }));

  it('responde 503 quando a simulação de instabilidade sorteia uma falha', fakeAsync(() => {
    TestBed.inject(FakeBackendConfig).setSimulateFailures(true);
    spyOn(Math, 'random').and.returnValue(0);

    const { error } = run(http.get('/api/employees', { observe: 'response' }));
    expect(error?.status).toBe(503);
  }));

  it('não falha com a simulação desligada', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0);
    const { response } = run(http.get('/api/employees', { observe: 'response' }));
    expect(response?.status).toBe(200);
  }));
});
