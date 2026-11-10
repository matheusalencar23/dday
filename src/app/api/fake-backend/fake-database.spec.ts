import { TestBed } from '@angular/core/testing';
import { PaymentStatus } from 'src/app/pages/internal/payment/models/payment-status.enum';
import { FakeDatabase, OPENING_LIQUIDITY } from './fake-database';

// Dados de referência dos mocks
const FINANCE_ID = 12;
const LEGAL_ID = 689;
const TIAGO_ID = 878; // responsável pelo Legal
const ANA_ID = 316; // funcionária do Finance

describe('FakeDatabase', () => {
  let db: FakeDatabase;

  beforeEach(() => {
    db = TestBed.inject(FakeDatabase);
  });

  it('não compartilha objetos com os mocks', () => {
    const other = new FakeDatabase();
    db.deleteEmployee(ANA_ID);
    expect(other.findEmployee(ANA_ID)).toBeDefined();
  });

  it('compara e-mails e nomes ignorando maiúsculas e espaços', () => {
    expect(db.isEmailTaken('  ANA.COSTA@example.test ')).toBeTrue();
    expect(db.isEmailTaken('ana.costa@example.test', ANA_ID)).toBeFalse();
    expect(db.isDepartmentNameTaken(' finance ')).toBeTrue();
    expect(db.isDepartmentNameTaken('Finance', FINANCE_ID)).toBeFalse();
  });

  it('gera ids sequenciais a partir do maior existente', () => {
    const maxId = Math.max(...db.getEmployees().map((employee) => employee.id));
    const created = db.insertEmployee({
      name: 'Nova Pessoa',
      email: 'nova@example.test',
      role: 'QA',
      departmentId: null,
    });
    expect(created.id).toBe(maxId + 1);
  });

  it('ao remover um departamento, seus funcionários ficam sem departamento', () => {
    const members = db.getEmployees().filter((employee) => employee.departmentId === FINANCE_ID);
    expect(members.length).toBeGreaterThan(0);

    db.deleteDepartment(FINANCE_ID);

    expect(db.findDepartment(FINANCE_ID)).toBeUndefined();
    members.forEach((member) => expect(db.findEmployee(member.id)?.departmentId).toBeNull());
  });

  it('ao remover um funcionário, os departamentos que ele gerenciava ficam sem responsável', () => {
    db.deleteEmployee(TIAGO_ID);

    expect(db.findEmployee(TIAGO_ID)).toBeUndefined();
    expect(db.findDepartment(LEGAL_ID)?.managerId).toBeNull();
  });

  it('calcula a liquidez a partir dos pagamentos pendentes', () => {
    const pending = db
      .getPayments()
      .filter((payment) => payment.status === PaymentStatus.PENDING)
      .reduce((total, payment) => total + payment.amount, 0);

    const liquidity = db.liquidity();

    expect(liquidity.pendingAmount).toBe(pending);
    expect(liquidity.availableLiquidity).toBe(Math.max(0, OPENING_LIQUIDITY - pending));
    expect(liquidity.liquidityPercent).toBe(
      Math.round((liquidity.availableLiquidity / OPENING_LIQUIDITY) * 100),
    );
  });

  it('agrega dados nas linhas de funcionários', () => {
    const tiago = db.employeeRows().find((row) => row.id === TIAGO_ID);
    expect(tiago?.department).toBe('Legal');
    expect(tiago?.managedDepartments).toEqual(['Legal']);
  });

  it('agrega responsável e quantidade de membros nas linhas de departamentos', () => {
    const legal = db.departmentRows().find((row) => row.id === LEGAL_ID);
    expect(legal?.managerName).toBe('Tiago Moreira');
    expect(legal?.employeeCount).toBe(
      db.getEmployees().filter((employee) => employee.departmentId === LEGAL_ID).length,
    );
  });

  it('exibe "—" nas linhas de pagamento quando o funcionário não existe mais', () => {
    const payment = db.getPayments().find((item) => item.employeeId === ANA_ID);
    db.deleteEmployee(ANA_ID);

    const row = db.paymentRows([payment!])[0];
    expect(row.employeeName).toBe('—');
    expect(row.departmentName).toBe('—');
  });
});
