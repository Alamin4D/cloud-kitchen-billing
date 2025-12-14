import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { deleteCorporateBill } from "../features/billing/billingSlice";
import ConfirmModal from "../components/ConfirmModal";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { formatBDT } from "../utils/money";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";

function CorporateBillCard({ bill, onView, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-500">{bill.invoiceNo}</div>
          <div className="mt-1 font-semibold text-slate-900 truncate">{bill.corporateName}</div>
          <div className="mt-1 text-sm text-slate-600">Date: {bill.billingDate}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Total</div>
          <div className="font-semibold text-slate-900">{formatBDT(bill.grandTotal)}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onView}>View</Button>
        <Button variant="secondary" className="flex-1" onClick={onEdit}>Edit</Button>
        <Button variant="danger" className="flex-1" onClick={onDelete}>Delete</Button>
      </div>
    </div>
  );
}

export default function CorporateListPage() {
  const bills = useAppSelector((s) => s.billing.corporateBills);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteId, setDeleteId] = useState(null);

  const rows = useMemo(() => bills, [bills]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No corporate bills yet"
        subtitle="Create your first corporate billing record."
        ctaLabel="Create Corporate Bill"
        onCta={() => navigate("/corporate/new")}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {rows.map((b) => (
          <CorporateBillCard
            key={b.id}
            bill={b}
            onView={() => navigate(`/corporate/${b.id}`)}
            onEdit={() => navigate(`/corporate/${b.id}/edit`)}
            onDelete={() => setDeleteId(b.id)}
          />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Corporate Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Billing Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">{b.invoiceNo}</td>
                <td className="px-4 py-3">{b.corporateName}</td>
                <td className="px-4 py-3">Corporate</td>
                <td className="px-4 py-3">{b.billingDate}</td>
                <td className="px-4 py-3 font-medium">{formatBDT(b.grandTotal)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => navigate(`/corporate/${b.id}`)}><MdOutlineRemoveRedEye size={20} /></Button>
                    <Button variant="secondary" onClick={() => navigate(`/corporate/${b.id}/edit`)}><CiEdit size={20} /></Button>
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
        title="Delete Corporate Bill"
        message="Are you sure you want to delete this bill? This cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) dispatch(deleteCorporateBill(deleteId));
          setDeleteId(null);
        }}
      />
    </div>
  );
}