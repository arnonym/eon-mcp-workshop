export const replaceAt = <T>(array: T[], index: number, newItem: T): T[] => {
  return array.map((item, i) => (i === index ? newItem : item));
}
