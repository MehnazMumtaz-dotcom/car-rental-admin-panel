import React, { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  History,
} from "lucide-react";

import { useSubAdminStore, PERMISSIONS } from "../../store/SubAdminStore";
import { useAuthStore } from "../../store/authStore";
import CreateSubAdmin from "./CreateSubAdmin";
import RoleManagement from "./RoleManagement";
import SubAdminList from "./SubAdminList";

function StatCard({ icon: Icon, label, value, sub, tone }) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    secondary: "bg-secondary/10 text-secondary",
  };

  return (
    <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tones[tone]}`}
      >
        <Icon size={20} />
      </div>
      <div>
        <p 
          className="text-xs font-semibold tracking-wide" 
          style={{ color: "#A17A4E" }}
        >
          {label}
        </p>
        <p className="text-xl font-semibold text-textPrimary">{value}</p>
        <p className="text-xs text-textSecondary">{sub}</p>
      </div>
    </div>
  );
}

const emptyForm = { name: "", email: "", status: "active", password: "" };

export default function SubAdminPage() {
  const allSubAdmins = useSubAdminStore((s) => s.subAdmins);
  const auditLog = useSubAdminStore((s) => s.auditLog);
  const createSubAdmin = useSubAdminStore((s) => s.createSubAdmin);
  const status = useSubAdminStore((s) => s.status);
  const adminCity = useAuthStore((s) => s.user?.city);

  // Multi-tenant: admin only ever sees/manages sub-admins for their own city
  const subAdmins = useMemo(
    () => allSubAdmins.filter((a) => !adminCity || a.city === adminCity),
    [allSubAdmins, adminCity]
  );

  const stats = useMemo(() => {
    const total = subAdmins.length;
    const active = subAdmins.filter((a) => a.status === "active").length;
    const fullAccess = subAdmins.filter(
      (a) => a.permissions.length === PERMISSIONS.length
    ).length;
    const restricted = total - fullAccess;
    return { total, active, fullAccess, restricted };
  }, [subAdmins]);

  const [formData, setFormData] = useState(emptyForm);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const togglePermission = (key) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    createSubAdmin({ ...formData, city: adminCity, permissions: selectedPermissions });
    setFormData(emptyForm);
    setSelectedPermissions([]);
  };

  const handleReset = () => {
    setFormData(emptyForm);
    setSelectedPermissions([]);
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Total Sub-Admins"
          value={String(stats.total).padStart(2, "0")}
          sub="All sub-admin accounts"
          tone="primary"
        />
        <StatCard
          icon={UserCheck}
          label="Active Sub-Admins"
          value={String(stats.active).padStart(2, "0")}
          sub="Currently active"
          tone="success"
        />
        <StatCard
          icon={ShieldCheck}
          label="With Full Access"
          value={String(stats.fullAccess).padStart(2, "0")}
          sub="Have all permissions"
          tone="warning"
        />
        <StatCard
          icon={ShieldAlert}
          label="Restricted Access"
          value={String(stats.restricted).padStart(2, "0")}
          sub="Limited permissions"
          tone="secondary"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 items-stretch">
        <CreateSubAdmin
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
        <RoleManagement
          selectedPermissions={selectedPermissions}
          onToggle={togglePermission}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <SubAdminList />
        </div>

        <div className="bg-surface rounded-xl shadow-card border border-borderColor p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <History size={16} className="text-textSecondary" />
            <h2 className="font-semibold text-red-600">
              Recent Activity (Audit Log)
            </h2>
          </div>
          <style>{`
            .audit-scroll::-webkit-scrollbar { display: none; }
          `}</style>
          <div
            className="audit-scroll space-y-3 max-h-80 overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 border-b border-borderColor last:border-0 pb-3 last:pb-0"
              >
                <div>
                  <p className="text-sm text-textPrimary">{log.action}</p>
                  <p className="text-xs text-textSecondary">by {log.by}</p>
                </div>
                <span className="text-xs text-textSecondary whitespace-nowrap">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}