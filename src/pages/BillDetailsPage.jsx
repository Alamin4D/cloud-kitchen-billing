import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import { useAppSelector } from "../app/hooks";
import { formatBDT } from "../utils/money";
import { CiEdit } from "react-icons/ci";
import { IoIosArrowRoundBack } from "react-icons/io";
import { PiPrinterLight } from "react-icons/pi";

export default function BillDetailsPage({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const bill = useAppSelector((s) =>
    type === "corporate"
      ? s.billing.corporateBills.find((b) => b.id === id)
      : s.billing.eventBills.find((b) => b.id === id)
  );

  if (!bill) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-700">Bill not found.</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => navigate(type === "corporate" ? "/corporate" : "/event")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const isCorporate = type === "corporate";
  const title = isCorporate ? bill.corporateName : bill.eventName;

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-sm text-slate-500">{bill.invoiceNo}</div>
          <div className="text-xl font-semibold text-slate-900">{title}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <PiPrinterLight size={20} />
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(isCorporate ? `/corporate/${bill.id}/edit` : `/event/${bill.id}/edit`)}
          >
            <CiEdit size={20} />
          </Button>
          <Button variant="secondary" onClick={() => navigate(isCorporate ? "/corporate" : "/event")}>
            <IoIosArrowRoundBack size={20} />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">Billing Type</div>
            <div className="font-semibold text-slate-900">{bill.billingType}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{isCorporate ? "Billing Date" : "Event Date"}</div>
            <div className="font-semibold text-slate-900">{isCorporate ? bill.billingDate : bill.eventDate}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Contact Person</div>
            <div className="font-semibold text-slate-900">{bill.contactPerson}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Contact No</div>
            <div className="font-semibold text-slate-900">{bill.contactNo}</div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                {isCorporate ? (
                  <>
                    <th className="px-4 py-3">Service Date</th>
                    <th className="px-4 py-3">Package Type</th>
                    <th className="px-4 py-3">Persons</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Total</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Persons</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Total</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {isCorporate
                ? bill.lineItems.map((it) => (
                    <tr key={it.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{it.serviceDate}</td>
                      <td className="px-4 py-3">{it.packageType}</td>
                      <td className="px-4 py-3">{it.persons}</td>
                      <td className="px-4 py-3">{formatBDT(it.unitPrice)}</td>
                      <td className="px-4 py-3 font-medium">{formatBDT(it.lineTotal)}</td>
                    </tr>
                  ))
                : bill.items.map((it) => (
                    <tr key={it.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">{it.packageName}</td>
                      <td className="px-4 py-3">{it.packageType}</td>
                      <td className="px-4 py-3">{it.description}</td>
                      <td className="px-4 py-3">{it.persons}</td>
                      <td className="px-4 py-3">{formatBDT(it.unitPrice)}</td>
                      <td className="px-4 py-3 font-medium">{formatBDT(it.lineTotal)}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Number of Packages</div>
            <div className="text-lg font-semibold text-slate-900">{bill.numberOfPackages}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Grand Total</div>
            <div className="text-lg font-semibold text-slate-900">{formatBDT(bill.grandTotal)}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-xs text-slate-500">Amount in Words</div>
            <div className="text-sm font-semibold text-slate-900">{bill.amountInWords}</div>
          </div>
        </div>
      </div>
    </div>
  );
}