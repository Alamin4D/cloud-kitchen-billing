import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Field from "../components/Field";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addCorporateBill, updateCorporateBill } from "../features/billing/billingSlice";
import { calcLineTotal, calcCorporateGrandTotal, sumPersonsCorporate } from "../features/billing/calculators";
import { numberToWordsBDT } from "../utils/amountInWords";
import { formatBDT } from "../utils/money";
import { nextInvoiceNo } from "../utils/invoice";

const defaultItem = () => ({
  id: nanoid(),
  serviceDate: "",
  packageType: "Economy",
  persons: 0,
  unitPrice: 0,
  lineTotal: 0,
});

export default function CorporateFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const seq = useAppSelector((s) => s.billing.invoiceSeq);
  const existing = useAppSelector((s) => s.billing.corporateBills.find((b) => b.id === id));

  const [corporateName, setCorporateName] = useState(existing?.corporateName ?? "");
  const [contactPerson, setContactPerson] = useState(existing?.contactPerson ?? "");
  const [contactNo, setContactNo] = useState(existing?.contactNo ?? "");
  const [billingDate, setBillingDate] = useState(existing?.billingDate ?? "");
  const [lineItems, setLineItems] = useState(
    existing?.lineItems?.length ? existing.lineItems : [defaultItem()]
  );

  const totalPersons = useMemo(() => sumPersonsCorporate(lineItems), [lineItems]);
  const grandTotal = useMemo(() => calcCorporateGrandTotal(lineItems), [lineItems]);
  const amountInWords = useMemo(() => numberToWordsBDT(grandTotal), [grandTotal]);

  const errors = useMemo(() => {
    const e = {};
    if (!corporateName.trim()) e.corporateName = "Corporate name is required";
    if (!contactPerson.trim()) e.contactPerson = "Contact person is required";
    if (!contactNo.trim()) e.contactNo = "Contact no is required";
    if (contactNo.trim() && !/^\d{10,14}$/.test(contactNo.trim())) e.contactNo = "Use digits only (10-14)";
    if (!billingDate) e.billingDate = "Billing date is required";
    if (!lineItems.length) e.lineItems = "At least 1 line item is required";

    lineItems.forEach((it, idx) => {
      if (!it.serviceDate) e[`serviceDate_${idx}`] = "Service date required";
      if (!String(it.packageType || "").trim()) e[`packageType_${idx}`] = "Package type required";
      if (!(Number(it.persons) > 0)) e[`persons_${idx}`] = "Persons must be > 0";
      if (!(Number(it.unitPrice) > 0)) e[`unitPrice_${idx}`] = "Unit price must be > 0";
    });

    return e;
  }, [corporateName, contactPerson, contactNo, billingDate, lineItems]);

  const isValid = Object.keys(errors).length === 0;

  const updateItem = (itemId, patch) => {
    setLineItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const next = { ...it, ...patch };
        const persons = Number(next.persons) || 0;
        const unitPrice = Number(next.unitPrice) || 0;
        next.lineTotal = calcLineTotal(persons, unitPrice);
        return next;
      })
    );
  };

  const removeItem = (itemId) => setLineItems((prev) => prev.filter((it) => it.id !== itemId));

  const onSave = () => {
    if (!isValid) return;

    const now = Date.now();
    const bill = {
      id: existing?.id ?? nanoid(),
      invoiceNo: existing?.invoiceNo ?? nextInvoiceNo(seq),
      billingType: "Corporate",
      corporateName: corporateName.trim(),
      contactPerson: contactPerson.trim(),
      contactNo: contactNo.trim(),
      billingDate,
      numberOfPackages: totalPersons,
      lineItems,
      grandTotal,
      amountInWords,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (mode === "edit" && existing) {
      dispatch(updateCorporateBill(bill));
      navigate(`/corporate/${bill.id}`);
    } else {
      dispatch(addCorporateBill(bill));
      navigate(`/corporate/${bill.id}`);
    }
  };

  if (mode === "edit" && !existing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-700">Bill not found.</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/corporate")}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === "edit" ? "Edit Corporate Bill" : "Create Corporate Bill"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">Billing Type: Corporate</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/corporate")}>Cancel</Button>
            <Button onClick={onSave} disabled={!isValid}>Save</Button>
          </div>
        </div>

        {!isValid ? (
          <p className="mt-3 text-xs text-slate-500">Fill required fields to enable Save.</p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Corporate Name" error={errors.corporateName}>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={corporateName}
              onChange={(e) => setCorporateName(e.target.value)}
              placeholder="e.g., X Ltd"
            />
          </Field>

          <Field label="Billing Date" error={errors.billingDate}>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
            />
          </Field>

          <Field label="Contact Person" error={errors.contactPerson}>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g., XYZ"
            />
          </Field>

          <Field label="Contact No" error={errors.contactNo}>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              placeholder="e.g., 017XXXXXXXX"
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">Line Items (Date-wise)</h3>
          <Button variant="secondary" onClick={() => setLineItems((p) => [...p, defaultItem()])}>
            + Add Row
          </Button>
        </div>

        {errors.lineItems ? <p className="mt-2 text-xs text-red-600">{errors.lineItems}</p> : null}

        <div className="mt-4 space-y-3">
          {lineItems.map((it, idx) => (
            <div key={it.id} className="rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                <Field label="Service Date" error={errors[`serviceDate_${idx}`]}>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.serviceDate}
                    onChange={(e) => updateItem(it.id, { serviceDate: e.target.value })}
                  />
                </Field>

                <Field label="Package Type" error={errors[`packageType_${idx}`]}>
                  <select
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.packageType}
                    onChange={(e) => updateItem(it.id, { packageType: e.target.value })}
                  >
                    <option value="Economy">Economy</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </Field>

                <Field label="Persons" error={errors[`persons_${idx}`]}>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.persons}
                    onChange={(e) => updateItem(it.id, { persons: Number(e.target.value) })}
                  />
                </Field>

                <Field label="Unit Price (BDT)" error={errors[`unitPrice_${idx}`]}>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.unitPrice}
                    onChange={(e) => updateItem(it.id, { unitPrice: Number(e.target.value) })}
                  />
                </Field>

                <div className="space-y-1 md:col-span-1">
                  <label className="text-sm font-medium text-slate-700">Line Total</label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                    {formatBDT(it.lineTotal)}
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <Button
                    variant="danger"
                    className="w-full md:w-auto"
                    onClick={() => removeItem(it.id)}
                    disabled={lineItems.length === 1}
                    title={lineItems.length === 1 ? "At least 1 row required" : "Remove"}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Number of Packages (Summary)</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{totalPersons}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Grand Total</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{formatBDT(grandTotal)}</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs text-slate-500">Amount in Words</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{amountInWords}</div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => navigate("/corporate")}>Back</Button>
          <Button onClick={onSave} disabled={!isValid}>Save</Button>
        </div>
      </div>
    </div>
  );
}