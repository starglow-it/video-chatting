export const mapToArray = <K extends string, V>(map: Map<K, V>) =>
  Array.from(map).map(([k, v]) => ({ [k]: v }));
