import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <ShieldAlert size={64} className="text-danger mb-4" />
      <h1 className="text-2xl font-bold text-textPrimary mb-2">
        403 — Access Denied
      </h1>
      <p className="text-textSecondary mb-6 max-w-md">
        Your account does not have permission to view this page. If you think this is a mistake, contact your admin.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
}