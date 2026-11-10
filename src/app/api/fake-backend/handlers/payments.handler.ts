import { PaymentStatus } from 'src/app/pages/internal/payment/models/payment-status.enum';
import { createTableView } from 'src/app/utils/table-view';
import { Route, fail, listFilter, ok } from '../http-utils';

const STATUSES = Object.values(PaymentStatus) as string[];

export const PAYMENT_ROUTES: Route[] = [
  {
    method: 'GET',
    pattern: /^\/api\/payments$/,
    handler: ({ db, query }) => {
      const status = query.get('status');
      if (status && !STATUSES.includes(status)) fail(400, 'invalidStatus', 'Status inválido.');

      const payments = status
        ? db.getPayments().filter((payment) => payment.status === status)
        : db.getPayments();
      return ok(
        createTableView(db.paymentRows(payments), listFilter(query), ['employeeName', 'departmentName'])
      );
    },
  },
];
