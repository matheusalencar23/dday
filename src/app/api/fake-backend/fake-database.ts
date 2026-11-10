import { Injectable } from '@angular/core';
import { DEPARTMENTS } from 'src/app/mocks/departments';
import { EMPLOYEES } from 'src/app/mocks/employees';
import { PAYMENTS } from 'src/app/mocks/payment';
import {
  Department,
  DepartmentInput,
  DepartmentRow,
} from 'src/app/pages/internal/departments/models/department';
import {
  Employee,
  EmployeeInput,
  EmployeeRow,
} from 'src/app/pages/internal/employees/models/employee';
import { Payment, PaymentListRow } from 'src/app/pages/internal/payment/models/payment';
import { PaymentStatus } from 'src/app/pages/internal/payment/models/payment-status.enum';

export const OPENING_LIQUIDITY = 250000;

const normalize = (value: string) => value.trim().toLocaleLowerCase();

/**
 * "Banco de dados" do backend simulado. Vive apenas em memória e só é
 * acessado pelos handlers do interceptor — nunca diretamente pela UI.
 */
@Injectable({ providedIn: 'root' })
export class FakeDatabase {
  private payments: Payment[] = PAYMENTS.map((payment) => ({ ...payment }));
  private employees: Employee[] = EMPLOYEES.map((employee) => ({ ...employee }));
  private departments: Department[] = DEPARTMENTS.map((department) => ({ ...department }));

  // ---------- Consultas ----------

  getPayments(): Payment[] {
    return this.payments;
  }

  getEmployees(): Employee[] {
    return this.employees;
  }

  getDepartments(): Department[] {
    return this.departments;
  }

  findEmployee(id: number): Employee | undefined {
    return this.employees.find((employee) => employee.id === id);
  }

  findDepartment(id: number): Department | undefined {
    return this.departments.find((department) => department.id === id);
  }

  isEmailTaken(email: string, ignoreId?: number): boolean {
    return this.employees.some(
      (employee) => employee.id !== ignoreId && normalize(employee.email) === normalize(email),
    );
  }

  isDepartmentNameTaken(name: string, ignoreId?: number): boolean {
    return this.departments.some(
      (department) => department.id !== ignoreId && normalize(department.name) === normalize(name),
    );
  }

  pendingPayments(): Payment[] {
    return this.payments.filter((payment) => payment.status === PaymentStatus.PENDING);
  }

  liquidity(): { pendingAmount: number; availableLiquidity: number; liquidityPercent: number } {
    const pendingAmount = this.pendingPayments().reduce(
      (total, payment) => total + payment.amount,
      0,
    );
    const availableLiquidity = Math.max(0, OPENING_LIQUIDITY - pendingAmount);
    return {
      pendingAmount,
      availableLiquidity,
      liquidityPercent: Math.round((availableLiquidity / OPENING_LIQUIDITY) * 100),
    };
  }

  // ---------- Linhas agregadas para listagens ----------

  paymentRows(payments: Payment[] = this.payments): PaymentListRow[] {
    const employees = new Map(this.employees.map((employee) => [employee.id, employee]));
    const departments = new Map(this.departments.map((department) => [department.id, department]));

    return payments.map((payment) => {
      const employee = employees.get(payment.employeeId);
      const department = departments.get(employee?.departmentId ?? -1);
      return {
        ...payment,
        employeeName: employee?.name ?? '—',
        departmentId: employee?.departmentId ?? null,
        departmentName: department?.name ?? '—',
      };
    });
  }

  employeeRows(): EmployeeRow[] {
    return this.employees.map((employee) => {
      const payments = this.payments.filter((payment) => payment.employeeId === employee.id);
      return {
        ...employee,
        department: this.findDepartment(employee.departmentId ?? -1)?.name ?? '—',
        paymentCount: payments.length,
        pendingAmount: sumPending(payments),
        managedDepartments: this.departments
          .filter((department) => department.managerId === employee.id)
          .map((department) => department.name),
      };
    });
  }

  departmentRows(): DepartmentRow[] {
    return this.departments.map((department) => {
      const members = new Set(
        this.employees
          .filter((employee) => employee.departmentId === department.id)
          .map((employee) => employee.id),
      );
      const payments = this.payments.filter((payment) => members.has(payment.employeeId));
      return {
        ...department,
        managerName: this.findEmployee(department.managerId ?? -1)?.name ?? '—',
        employeeCount: members.size,
        paymentCount: payments.length,
        pendingAmount: sumPending(payments),
      };
    });
  }

  // ---------- Escrita ----------

  insertEmployee(input: EmployeeInput): Employee {
    const employee = { ...input, id: nextId(this.employees) };
    this.employees = [...this.employees, employee];
    return employee;
  }

  updateEmployee(id: number, input: EmployeeInput): Employee {
    const employee = { ...input, id };
    this.employees = this.employees.map((item) => (item.id === id ? employee : item));
    return employee;
  }

  /** Remove o funcionário; departamentos que ele gerenciava ficam sem responsável. */
  deleteEmployee(id: number): void {
    this.employees = this.employees.filter((employee) => employee.id !== id);
    this.departments = this.departments.map((department) =>
      department.managerId === id ? { ...department, managerId: null } : department,
    );
  }

  insertDepartment(input: DepartmentInput): Department {
    const department = { ...input, id: nextId(this.departments) };
    this.departments = [...this.departments, department];
    return department;
  }

  updateDepartment(id: number, input: DepartmentInput): Department {
    const department = { ...input, id };
    this.departments = this.departments.map((item) => (item.id === id ? department : item));
    return department;
  }

  /** Remove o departamento; seus funcionários ficam sem departamento. */
  deleteDepartment(id: number): void {
    this.departments = this.departments.filter((department) => department.id !== id);
    this.employees = this.employees.map((employee) =>
      employee.departmentId === id ? { ...employee, departmentId: null } : employee,
    );
  }
}

function sumPending(payments: Payment[]): number {
  return payments
    .filter((payment) => payment.status === PaymentStatus.PENDING)
    .reduce((total, payment) => total + payment.amount, 0);
}

function nextId(items: Array<{ id: number }>): number {
  return items.reduce((maximum, item) => Math.max(maximum, item.id), 0) + 1;
}
