import { NavLink } from "react-router-dom";

const linkBase =
  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition";
const active = "bg-slate-900 text-white";
const idle = "text-slate-700 hover:bg-slate-100";

function SidebarLinks({ onNavigate }) {
  return (
    <div className="mt-6 space-y-2">
      <NavLink
        to="/corporate"
        onClick={onNavigate}
        className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
      >
        Corporate Billing
      </NavLink>
      <NavLink
        to="/event"
        onClick={onNavigate}
        className={({ isActive }) => `${linkBase} ${isActive ? active : idle}`}
      >
        Event Billing
      </NavLink>
    </div>
  );
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="no-print hidden w-64 flex-col border-r border-slate-200 bg-white p-4 md:flex">
        <div className="text-lg font-semibold text-slate-900">Cloud Kitchen</div>
        <SidebarLinks />
        <div className="mt-auto pt-6 text-xs text-slate-500">
          Frontend only • Redux + Tailwind
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="no-print fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-[85%] max-w-xs bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">Cloud Kitchen</div>
              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                onClick={onClose}
                aria-label="Close menu"
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <SidebarLinks onNavigate={onClose} />

            <div className="mt-auto pt-6 text-xs text-slate-500">
              Frontend only • Redux + Tailwind
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}