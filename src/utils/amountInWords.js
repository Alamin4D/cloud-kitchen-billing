export function numberToWordsBDT(n) {
  n = Math.floor(Number(n || 0));
  if (n === 0) return "BDT Zero Only";
  if (n < 0) return "BDT Minus " + numberToWordsBDT(-n).replace(/^BDT\s*/, "").replace(/\sOnly$/, "") + " Only";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (x) => {
    if (x === 0) return "";
    if (x < 20) return ones[x];
    const t = Math.floor(x / 10);
    const o = x % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  };

  const threeDigits = (x) => {
    const h = Math.floor(x / 100);
    const r = x % 100;
    let s = "";
    if (h) s += ones[h] + " Hundred";
    if (r) s += (s ? " " : "") + twoDigits(r);
    return s;
  };

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  const rest = n % 1000;

  const parts = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (rest) parts.push(threeDigits(rest));

  return "BDT " + parts.join(" ") + " Only";
}