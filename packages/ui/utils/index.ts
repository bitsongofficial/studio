export function formatShortAddress(address: string | undefined, end = 4) {
  if (!address)
    return undefined;

  const splitted = address.split("1");

  return `${splitted.shift() ?? ""}1...${address.slice(-end)}`;
}
