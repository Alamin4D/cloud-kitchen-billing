import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteEventBill } from "../features/billing/billingSlice";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { formatBDT } from "../utils/money";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function EventListPage() {
  const bills = useAppSelector((s) => s.billing.eventBills);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteId, setDeleteId] = useState(null);

  const rows = useMemo(() => bills, [bills]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No event bills yet"
        subtitle="Create your first event billing record."
        ctaLabel="Create Event Bill"
        onCta={() => navigate("/event/new")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Event Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{b.invoiceNo}</td>
                <td className="px-4 py-3">{b.eventName}</td>
                <td className="px-4 py-3">Event</td>
                <td className="px-4 py-3">{b.eventDate}</td>
                <td className="px-4 py-3 font-medium">{formatBDT(b.grandTotal)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/event/${b.id}`)}><MdOutlineRemoveRedEye size={20} /></Button>
                    <Button variant="secondary" onClick={() => navigate(`/event/${b.id}/edit`)}><CiEdit size={20} /></Button>
                    <Button variant="danger" onClick={() => setDeleteId(b.id)}><RiDeleteBin6Line size={20} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Event Bill"
        message="Are you sure you want to delete this bill? This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) dispatch(deleteEventBill(deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}