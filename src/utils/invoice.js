export function nextInvoiceNo(seq) {
  const s = String(seq).padStart(5, "0");
  return `INV-${s}`;
}