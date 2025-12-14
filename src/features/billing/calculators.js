import { clampMoney } from "../../utils/money";

export function calcLineTotal(persons, unitPrice) {
  const p = Number.isFinite(persons) ? persons : 0;
  const u = Number.isFinite(unitPrice) ? unitPrice : 0;
  return clampMoney(p * u);
}

export function calcCorporateGrandTotal(items) {
  return clampMoney(items.reduce((sum, it) => sum + (it.lineTotal || 0), 0));
}

export function calcEventGrandTotal(items) {
  return clampMoney(items.reduce((sum, it) => sum + (it.lineTotal || 0), 0));
}

export function sumPersonsCorporate(items) {
  return items.reduce((sum, it) => sum + (Number(it.persons) || 0), 0);
}

export function sumPersonsEvent(items) {
  return items.reduce((sum, it) => sum + (Number(it.persons) || 0), 0);
}