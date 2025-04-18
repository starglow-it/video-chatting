export const toNumber = (str: string | undefined, def: number): number => {
  const num = Number(str) || def;

  return Number.isNaN(num) ? def : num;
};
