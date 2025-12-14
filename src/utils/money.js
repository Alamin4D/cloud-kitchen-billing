export function clampMoney(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n)); // integer BDT
}

export function formatBDT(n) {
  const x = clampMoney(n);
  return x.toLocaleString("en-US") + " BDT";
}