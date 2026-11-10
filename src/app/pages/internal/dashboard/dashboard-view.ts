import { DashboardData } from 'src/app/api/api.models';
import { CardInfo } from './models/card-info';

export interface DashboardView {
  cards: CardInfo[];
  liquidityPercent: number;
  monthlyLabels: string[];
  monthlyPaymentSeries: Array<{ name: string; data: number[] }>;
  yearlyLabels: string[];
  yearlyRequestCounts: number[];
  yearlyAmountTotals: number[];
}

/** Transforma os números do servidor no que a tela exibe, no idioma atual. */
export function toDashboardView(data: DashboardData, language: string): DashboardView {
  const locale = language === 'pt' ? 'pt-BR' : 'en-US';

  return {
    cards: [
      { title: 'app.dashboard.cards.pending-amount', value: data.pendingAmount, isCurrency: true },
      { title: 'app.dashboard.cards.average-payment', value: data.averageAmount, isCurrency: true },
      { title: 'app.dashboard.cards.request-number', value: data.requestCount, isCurrency: false },
      {
        title: 'app.dashboard.cards.available-liquidity',
        value: data.availableLiquidity,
        isCurrency: true,
      },
    ],
    liquidityPercent: data.liquidityPercent,
    monthlyLabels: Array.from({ length: 12 }, (_, month) =>
      new Date(2024, month, 1).toLocaleDateString(locale, { month: 'short' }),
    ),
    monthlyPaymentSeries: data.monthly.map(({ year, values }) => ({
      name: String(year),
      data: values,
    })),
    yearlyLabels: data.yearly.map(({ year }) => String(year)),
    yearlyRequestCounts: data.yearly.map(({ count }) => count),
    yearlyAmountTotals: data.yearly.map(({ amount }) => amount),
  };
}
