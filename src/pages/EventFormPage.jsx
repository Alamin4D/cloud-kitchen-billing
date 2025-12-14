import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import Field from "../components/Field";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addEventBill, updateEventBill } from "../features/billing/billingSlice";
import { calcLineTotal, calcEventGrandTotal, sumPersonsEvent } from "../features/billing/calculators";
import { numberToWordsBDT } from "../utils/amountInWords";
import { formatBDT } from "../utils/money";
import { nextInvoiceNo } from "../utils/invoice";

const defaultItem = () => ({
  id: nanoid(),
  packageName: "",
  packageType: "Economy",
  description: "",
  persons: 0,
  unitPrice: 0,
  lineTotal: 0,
});

export default function EventFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const seq = useAppSelector((s) => s.billing.invoiceSeq);
  const existing = useAppSelector((s) => s.billing.eventBills.find((b) => b.id === id));

  const [eventName, setEventName] = useState(existing?.eventName ?? "");
  const [contactPerson, setContactPerson] = useState(existing?.contactPerson ?? "");
  const [contactNo, setContactNo] = useState(existing?.contactNo ?? "");
  const [eventDate, setEventDate] = useState(existing?.eventDate ?? "");
  const [items, setItems] = useState(existing?.items?.length ? existing.items : [defaultItem()]);

  const totalPersons = useMemo(() => sumPersonsEvent(items), [items]);
  const grandTotal = useMemo(() => calcEventGrandTotal(items), [items]);
  const amountInWords = useMemo(() => numberToWordsBDT(grandTotal), [grandTotal]);

  const errors = useMemo(() => {
    const e = {};
    if (!eventName.trim()) e.eventName = "Event name is required";
    if (!contactPerson.trim()) e.contactPerson = "Contact person is required";
    if (!contactNo.trim()) e.contactNo = "Contact no is required";
    if (contactNo.trim() && !/^\d{10,14}$/.test(contactNo.trim())) e.contactNo = "Use digits only (10-14)";
    if (!eventDate) e.eventDate = "Event date is required";
    if (!items.length) e.items = "At least 1 package item is required";

    items.forEach((it, idx) => {
      if (!it.packageName.trim()) e[`packageName_${idx}`] = "Package name required";
      if (!String(it.packageType || "").trim()) e[`packageType_${idx}`] = "Package type required";
      if (!it.description.trim()) e[`description_${idx}`] = "Description required";
      if (!(Number(it.persons) > 0)) e[`persons_${idx}`] = "Persons must be > 0";
      if (!(Number(it.unitPrice) > 0)) e[`unitPrice_${idx}`] = "Unit price must be > 0";
    });

    return e;
  }, [eventName, contactPerson, contactNo, eventDate, items]);

  const isValid = Object.keys(errors).length === 0;

  const updateItem = (itemId, patch) => {
    setItems((prev) =>
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

  const removeItem = (itemId) => setItems((prev) => prev.filter((it) => it.id !== itemId));

  const onSave = () => {
    if (!isValid) return;

    const now = Date.now();
    const bill = {
      id: existing?.id ?? nanoid(),
      invoiceNo: existing?.invoiceNo ?? nextInvoiceNo(seq),
      billingType: "Event",
      eventName: eventName.trim(),
      contactPerson: contactPerson.trim(),
      contactNo: contactNo.trim(),
      eventDate,
      numberOfPackages: totalPersons,
      items,
      grandTotal,
      amountInWords,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    if (mode === "edit" && existing) {
      dispatch(updateEventBill(bill));
      navigate(`/event/${bill.id}`);
    } else {
      dispatch(addEventBill(bill));
      navigate(`/event/${bill.id}`);
    }
  };

  if (mode === "edit" && !existing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-700">Bill not found.</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate("/event")}>Back</Button>
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
              {mode === "edit" ? "Edit Event Bill" : "Create Event Bill"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">Billing Type: Event</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate("/event")}>Cancel</Button>
            <Button onClick={onSave} disabled={!isValid}>Save</Button>
          </div>
        </div>

        {!isValid ? (
          <p className="mt-3 text-xs text-slate-500">Fill required fields to enable Save.</p>
        ) : null}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Event Name" error={errors.eventName}>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., X Event"
            />
          </Field>

          <Field label="Event Date" error={errors.eventDate}>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
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
          <h3 className="text-base font-semibold text-slate-900">Package Items</h3>
          <Button variant="secondary" onClick={() => setItems((p) => [...p, defaultItem()])}>
            + Add Row
          </Button>
        </div>

        {errors.items ? <p className="mt-2 text-xs text-red-600">{errors.items}</p> : null}

        <div className="mt-4 space-y-3">
          {items.map((it, idx) => (
            <div key={it.id} className="rounded-xl border border-slate-200 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                <Field label="Package Name" error={errors[`packageName_${idx}`]}>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.packageName}
                    onChange={(e) => updateItem(it.id, { packageName: e.target.value })}
                    placeholder="Package-1"
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

                <Field label="Description" error={errors[`description_${idx}`]}>
                  <input
                    className="w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={it.description}
                    onChange={(e) => updateItem(it.id, { description: e.target.value })}
                    placeholder="Food items (short)"
                  />
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

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Line Total</label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold">
                    {formatBDT(it.lineTotal)}
                  </div>
                  <Button
                    variant="danger"
                    className="mt-2 w-full"
                    onClick={() => removeItem(it.id)}
                    disabled={items.length === 1}
                    title={items.length === 1 ? "At least 1 row required" : "Remove"}
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
            <div className="text-xs text-slate-500">Number of Packages (Total Persons)</div>
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
          <Button variant="secondary" onClick={() => navigate("/event")}>Back</Button>
          <Button onClick={onSave} disabled={!isValid}>Save</Button>
        </div>
      </div>
    </div>
  );
}