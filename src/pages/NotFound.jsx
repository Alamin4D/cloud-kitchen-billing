import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Page not found</h2>
      <p className="mt-1 text-sm text-slate-600">The page you are looking for doesn’t exist.</p>
      <div className="mt-4">
        <Button variant="secondary" onClick={() => navigate("/corporate")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}