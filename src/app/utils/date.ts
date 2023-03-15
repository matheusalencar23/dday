const months: string[] = [
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

function reorderMonths(): string[] {
  const currentMonth = new Date().getMonth();
  const monthsInTheCurrentYear = months.slice(0, currentMonth + 1);
  const monthsInTheLastYear = months.slice(currentMonth + 1);
  return monthsInTheLastYear.concat(monthsInTheCurrentYear).map((month, i) => {
    const [currentYear, lastYear] = getCurrentAndLastYear();
    return i >= 11 - currentMonth
      ? `${month}/${currentYear}`
      : `${month}/${lastYear}`;
  });
}

function getCurrentAndLastYear(): string[] {
  return [
    new Date().getFullYear().toString().slice(2),
    (new Date().getFullYear() - 1).toString().slice(2),
  ];
}

export { months, reorderMonths };
