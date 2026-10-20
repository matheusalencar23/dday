const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getRollingMonthLabels(): string[] {
  const currentMonth = new Date().getMonth();
  const months = MONTHS.slice(currentMonth + 1).concat(MONTHS.slice(0, currentMonth + 1));
  const currentYear = String(new Date().getFullYear()).slice(-2);
  const previousYear = String(new Date().getFullYear() - 1).slice(-2);

  return months.map((month, index) =>
    `${month}/${index < 11 - currentMonth ? previousYear : currentYear}`
  );
}

export function generateRandomChartData(size: number): number[] {
  return Array.from({ length: size }, () => Number((Math.random() * 500).toFixed(2)));
}
