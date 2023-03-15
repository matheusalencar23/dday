function generateRandomData(size: number): number[] {
  const data: number[] = [];
  for (let i = 0; i <= size; i++) {
    const value = Number((Math.random() * 500).toFixed(2));
    data.push(value);
  }
  return data;
}

export { generateRandomData };
