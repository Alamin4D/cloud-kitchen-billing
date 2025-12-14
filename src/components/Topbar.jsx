import { useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isCorporate = location.pathname.startsWith("/corporate");
  const isEvent = location.pathname.startsWith("/event");

  return (
    <div className="no-print flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
          onClick={onMenuClick}
          aria-label="Open menu"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="min-w-0">
          <div className="text-sm text-slate-500">Dashboard</div>
          <div className="text-base font-semibold text-slate-900 truncate">
            {isCorporate ? "Corporate Billing" : isEvent ? "Event Billing" : "Billing"}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isCorporate ? (
          <Button onClick={() => navigate("/corporate/new")} className="hidden sm:inline-flex">
            + New Corporate Bill
          </Button>
        ) : null}
        {isEvent ? (
          <Button onClick={() => navigate("/event/new")} className="hidden sm:inline-flex">
            + New Event Bill
          </Button>
        ) : null}

        {/* Mobile small CTA */}
        {isCorporate ? (
          <Button onClick={() => navigate("/corporate/new")} className="sm:hidden px-3">
            + New
          </Button>
        ) : null}
        {isEvent ? (
          <Button onClick={() => navigate("/event/new")} className="sm:hidden px-3">
            + New
          </Button>
        ) : null}
      </div>
    </div>
  );
}