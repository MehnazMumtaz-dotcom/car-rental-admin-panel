import React, { useState, useEffect } from "react";
import { ShieldCheck, KeyRound, User, Save, RefreshCw, QrCode } from "lucide-react";
import { useAuthStore } from "../store/authStore"; 

export default function ProfileSettings() {
  const loggedInUser = useAuthStore((state) => state.user);

  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isToggling2FA, setIsToggling2FA] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [is2FAEnabled, setIs2FAEnabled] = useState(loggedInUser?.is2FAEnabled || true);
  const [qrCodeUrl, setQrCodeUrl] = useState(""); 

  useEffect(() => {
    if (is2FAEnabled) {
      setQrCodeUrl("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CarRentalAdmin2FA");
    }
  }, [is2FAEnabled]);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setIsSavingPassword(true);
    try {
      
      // const response = await axios.put("/api/admin/change-password", passwords);
      await new Promise((resolve) => setTimeout(resolve, 1200)); 
      
      alert("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Failed to update password. Try again.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handle2FAToggle = async () => {
    setIsToggling2FA(true);
    const newStatus = !is2FAEnabled;
    try {

      // await axios.post("/api/admin/toggle-2fa", { enabled: newStatus });
      await new Promise((resolve) => setTimeout(resolve, 800)); 
      
      setIs2FAEnabled(newStatus);
    } catch (error) {
      alert("Failed to change 2FA status.");
    } finally {
      setIsToggling2FA(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 text-textPrimary bg-background min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-textPrimary">
          Account Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-textSecondary">
          Manage your secure admin credentials, cryptographic logs, and Multi-Tenant protection tokens.
        </p>
      </div>

      <hr className="border-borderColor" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-surface p-5 rounded-xl border border-borderColor shadow-card h-fit space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <User size={20} />
            </div>
            <h2 className="font-semibold text-base text-textPrimary">Session Context</h2>
          </div>
          
          <div className="space-y-3 pt-2 text-xs sm:text-sm border-t border-borderColor/60">
            <div>
              <span className="block text-textSecondary font-medium">Administrator</span>
              <span className="font-semibold">{loggedInUser?.name || "Super Admin"}</span>
            </div>
            <div>
              <span className="block text-textSecondary font-medium">System Alias ID</span>
              <span className="font-mono text-xs bg-background px-1.5 py-0.5 rounded text-textPrimary">
                {loggedInUser?.id || "ADM-786-POSTGRES"}
              </span>
            </div>
            <div>
              <span className="block text-textSecondary font-medium">System Permission Role</span>
              <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-wider bg-secondary text-white px-2 py-0.5 rounded">
                Primary Tenant Root
              </span>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-textSecondary border-t border-borderColor/60 pt-3">
            Your login context protects global financial setups (commissions, PKR minimum base tariff ratios, sub-admin tiers). Keep this device audited.
          </p>
        </div>
        <div className="lg:col-span-2 space-y-6">
  
          <div className="bg-surface p-4 sm:p-6 rounded-xl border border-borderColor shadow-card">
            <div className="flex items-center gap-2 mb-5 border-b border-borderColor pb-3">
              <KeyRound size={18} className="text-textSecondary" />
              <h3 className="font-semibold text-base sm:text-lg text-textPrimary">Update Secure Hash Password</h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-borderColor rounded-lg text-sm bg-background text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                    New Core Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 chars"
                    className="w-full px-3 py-2 border border-borderColor rounded-lg text-sm bg-background text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-textSecondary mb-1.5">
                    Verify New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 border border-borderColor rounded-lg text-sm bg-background text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm disabled:opacity-60"
                >
                  {isSavingPassword ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSavingPassword ? "Hashing Credentials..." : "Commit Secure Changes"}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-surface p-4 sm:p-6 rounded-xl border border-borderColor shadow-card">
            <div className="flex items-center justify-between border-b border-borderColor pb-3 mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className={is2FAEnabled ? "text-success" : "text-warning"} />
                <h3 className="font-semibold text-base sm:text-lg text-textPrimary">Two-Factor Authenticator (2FA)</h3>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                is2FAEnabled 
                  ? "bg-success/10 text-success border border-success/20" 
                  : "bg-warning/10 text-warning border border-warning/20"
              }`}>
                {is2FAEnabled ? "Enforced" : "Vulnerable"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <p className="text-sm font-semibold text-textPrimary">
                  Secure Session via OTP Tokens (Google Authenticator / Authy)
                </p>
                <p className="text-xs text-textSecondary leading-relaxed max-w-md">
                  According to Phase-1 security parameters, multi-tenant businesses require dual-layer authorization. Turning this off exposes commission configuration controls.
                </p>
              </div>

              <button
                type="button"
                disabled={isToggling2FA}
                onClick={handle2FAToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  is2FAEnabled ? "bg-success" : "bg-borderColor"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
                    is2FAEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {is2FAEnabled && qrCodeUrl && (
              <div className="mt-6 p-4 bg-background rounded-xl border border-borderColor flex flex-col sm:flex-row items-center gap-5 animate-fadeIn">
                <div className="bg-surface p-2.5 rounded-lg border border-borderColor shadow-sm">
                  <img src={qrCodeUrl} alt="2FA Deployment Token" className="w-32 h-32 sm:w-36 sm:h-36" />
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-textPrimary uppercase tracking-wide">
                    <QrCode size={14} className="text-primary" />
                    Cryptographic Activation Code
                  </div>
                  <p className="text-xs text-textSecondary leading-relaxed">
                    Scan this matrix barcode with your Mobile device application to seed authorization tokens. The server expects continuous validation synchronizations.
                  </p>
                  <div className="pt-1">
                    <span className="text-[11px] font-mono bg-surface border border-borderColor px-2 py-1 rounded text-textSecondary select-all">
                      SEED-TOKEN-BASE64-HEX-STRING-PRISMA
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}