import React, { useState, useEffect } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/api";
import {
  User,
  Lock,
  ShieldCheck,
  Mail,
  Shield,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  KeyRound,
  FileClock,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

function SectionCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bg-surface border border-borderColor rounded-xl shadow-card p-5">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}
        >
          <Icon size={18} />
        </div>
        <h2 className="font-semibold text-textPrimary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        label={label}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-[34px] text-textSecondary"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const LOG_ICON = {
  password: { icon: KeyRound, bg: "bg-success/10", color: "text-success" },
  security: { icon: ShieldCheck, bg: "bg-success/10", color: "text-success" },
  login: { icon: Monitor, bg: "bg-primary/10", color: "text-primary" },
  email: { icon: Mail, bg: "bg-danger/10", color: "text-danger" },
};

const DEFAULT_LOG_ICON = { icon: FileClock, bg: "bg-warning/10", color: "text-warning" };

export default function ProfileSettings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [sessions, setSessions] = useState([]);
  const [securityLogs, setSecurityLogs] = useState([]);

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);


  const [lastLogin, setLastLogin] = useState(null);

  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        const data = res.data || {};
        const admin = data.admin || {};

        setProfile(data);
        setFullName(admin.name || "");
        setEmail(admin.email || "");
        setAvatar(data.avatar ?? null);
        setPhone(data.phone ?? null);
        setIs2FAEnabled(true);

        setLastLogin({
          time: admin.lastLogin
            ? new Date(admin.lastLogin).toLocaleString()
            : null,
          device: data.lastLoginDevice || null,
          ip: data.lastLoginIp || null,
        });
      } catch (error) {
        console.log("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await api.get("/profile/sessions");
        setSessions(res.data || []);
      } catch (error) {
        console.log("Sessions Error:", error);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await api.get("/profile/logs");
        setSecurityLogs(res.data || []);
      } catch (error) {
        console.log("Logs Error:", error);
      }
    };

    fetchProfile();
    fetchSessions();
    fetchLogs();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await api.patch("/profile/update", {
        name: fullName,
        avatar,
        phone,
      });
      alert("Profile updated successfully");
    } catch (error) {
      console.log("Update Profile Error:", error);
    }
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    try {
      await api.post("/profile/send-otp");
      setOtpSent(true);
    } catch (error) {
      console.log("Send OTP Error:", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/profile/verify-otp", { otp });
      if (res.data?.message) {
        setOtpVerified(true);
      } else {
        alert("Invalid OTP");
      }
    } catch (error) {
      console.log("Verify OTP Error:", error);
      alert("Invalid OTP");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const res = await api.patch("/profile/change-password", {
        currentPassword,
        newPassword,
      });

      alert(res.data?.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setOtpSent(false);
      setOtpVerified(false);
    } catch (error) {
      console.log("Password Error:", error);
    }
  };

  const handleChangeEmail = async () => {
    try {
      await api.post("/profile/change-email", {
        email: newEmail,
      });
      alert("Email updated successfully");
      setEmail(newEmail);
      setNewEmail("");
    } catch (error) {
      console.log("Change Email Error:", error);
    }
  };

  const revokeSession = async (id) => {
    try {
      await api.delete(`/profile/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.log("Revoke Session Error:", error);
    }
  };

  const revokeAllOthers = async () => {
    try {
      await api.delete("/profile/sessions");
      setSessions((prev) => prev.filter((s) => s.thisDevice));
    } catch (error) {
      console.log("Revoke All Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex flex-col gap-4 sm:gap-6">
          <SectionCard icon={User} iconBg="bg-primary/10" iconColor="text-primary" title="Profile Information">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1 space-y-4">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-textSecondary">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="px-3 py-2 rounded-xl border border-borderColor bg-background text-textSecondary text-sm cursor-not-allowed"
                  />
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </div>
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shrink-0 self-center sm:self-start">
                {fullName?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Lock} iconBg="bg-accent/10" iconColor="text-accent" title="Change Password">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <PasswordInput label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" />
                <PasswordInput label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                <PasswordInput label="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" />
              </div>

     
              <div className="relative pl-9">
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-borderColor" />


                <div className="relative mb-6">
                  <span
                    className={`absolute -left-9 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      otpSent ? "bg-success text-white" : "bg-primary text-white"
                    }`}
                  >
                    {otpSent ? <Check size={13} /> : "1"}
                  </span>
                  <p className="text-sm font-semibold text-textPrimary">Send OTP</p>
                  <p className="text-xs text-textSecondary mb-2">Click the button to send OTP to your email</p>
                  {!otpSent && (
                    <Button variant="primary" onClick={handleSendOtp} className="w-full">
                      Send OTP
                    </Button>
                  )}
                </div>

                <div className="relative mb-6">
                  <span
                    className={`absolute -left-9 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      otpVerified
                        ? "bg-success text-white"
                        : otpSent
                        ? "bg-primary text-white"
                        : "bg-borderColor text-textSecondary"
                    }`}
                  >
                    {otpVerified ? <Check size={13} /> : "2"}
                  </span>
                  <p className={`text-sm font-semibold ${otpSent ? "text-textPrimary" : "text-textSecondary"}`}>
                    Enter OTP
                  </p>
                  <p className="text-xs text-textSecondary mb-2">Enter the 6-digit code sent to your email</p>
                  {otpSent && !otpVerified && (
                    <div className="space-y-2">
                      <input
                        className="w-full px-3 py-2 rounded-xl border border-borderColor bg-surface text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <Button variant="primary" onClick={handleVerifyOtp} className="w-full">
                        Verify OTP
                      </Button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-9 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      otpVerified ? "bg-primary text-white" : "bg-borderColor text-textSecondary"
                    }`}
                  >
                    3
                  </span>
                  <p className={`text-sm font-semibold ${otpVerified ? "text-textPrimary" : "text-textSecondary"}`}>
                    Update Password
                  </p>
                  <p className="text-xs text-textSecondary mb-2">
                    {otpVerified ? "OTP verified! You can now update your password." : "Complete the steps above first."}
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleUpdatePassword}
                    disabled={!otpVerified}
                    className="w-full"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Monitor} iconBg="bg-primary/10" iconColor="text-primary" title="Active Sessions">
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-borderColor rounded-xl p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center text-textSecondary shrink-0">
                      {s.device?.toLowerCase().includes("iphone") ? (
                        <Smartphone size={18} />
                      ) : (
                        <Monitor size={18} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-textPrimary text-sm truncate">{s.device}</p>
                        {s.thisDevice && (
                          <span className="text-[10px] font-medium bg-success/10 text-success px-2 py-0.5 rounded-full whitespace-nowrap">
                            This Device
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-textSecondary truncate">
                        {s.location ? `${s.location} • ` : ""}
                        {s.ip}
                      </p>
                    </div>
                  </div>

                  {s.thisDevice ? (
                    <span className="flex items-center gap-1.5 text-success text-xs font-semibold whitespace-nowrap pl-12 sm:pl-0">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Active Now
                    </span>
                  ) : (
                    <div className="flex items-center gap-3 pl-12 sm:pl-0">
                      <span className="text-xs text-textSecondary whitespace-nowrap">{s.lastActive}</span>
                      <button
                        onClick={() => revokeSession(s.id)}
                        className="flex items-center gap-1 text-xs font-medium text-danger border border-danger/30 rounded-lg px-3 py-1.5 hover:bg-danger/10 whitespace-nowrap"
                      >
                        <Trash2 size={13} />
                        Revoke
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={revokeAllOthers}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-danger border border-danger/30 rounded-xl py-2 hover:bg-danger/10"
              >
                <Trash2 size={14} />
                Revoke All Other Sessions
              </button>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6">
          <SectionCard icon={Shield} iconBg="bg-success/10" iconColor="text-success" title="Last Login Information">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-textSecondary shrink-0">
                  <Clock size={15} /> Last Login
                </span>
                <span className="font-medium text-success text-right truncate">{lastLogin?.time || "Not available"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-textSecondary shrink-0">
                  <Monitor size={15} /> Device
                </span>
                <span
                  className="font-medium text-textPrimary text-right truncate max-w-[65%]"
                  title={lastLogin?.device || "Not tracked"}
                >
                  {lastLogin?.device || "Not tracked"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-textSecondary shrink-0">
                  <Globe size={15} /> IP Address
                </span>
                <span className="font-medium text-textPrimary text-right truncate">{lastLogin?.ip || "Not tracked"}</span>
              </div>
            </div>
          </SectionCard>
          <SectionCard icon={Mail} iconBg="bg-success/10" iconColor="text-success" title="Change Email">
            <div className="flex items-start gap-2 bg-primary/10 text-primary text-sm rounded-lg p-3 mb-4">
              <span className="mt-0.5">ℹ️</span>
              Your email will be updated immediately after you submit.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <Input
                  label="New Email Address"
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <Button
                variant="primary"
                className="sm:w-auto whitespace-nowrap bg-success hover:opacity-90"
                onClick={handleChangeEmail}
              >
                Update Email
              </Button>
            </div>
          </SectionCard>
          <SectionCard icon={ShieldCheck} iconBg="bg-accent/10" iconColor="text-accent" title="Two Factor Authentication (2FA)">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-textSecondary mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                    is2FAEnabled ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                  }`}
                >
                  {is2FAEnabled && <Check size={12} />}
                  {is2FAEnabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  alert(
                    "2FA is mandatory for all accounts — a code is sent to your email on every login, and it can't be turned off."
                  )
                }
              >
                Manage 2FA
              </Button>
            </div>
            <p className="text-xs text-textSecondary">2FA adds an extra layer of security to your account.</p>
          </SectionCard>

          <SectionCard icon={FileClock} iconBg="bg-warning/10" iconColor="text-warning" title="Security Logs">
            <div className="space-y-3">
              {securityLogs.map((log, i) => {
                const meta = LOG_ICON[log.type] || DEFAULT_LOG_ICON;
                const LogIcon = meta.icon;
                return (
                  <div key={log.id || i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                      <LogIcon size={13} />
                    </div>
                    <p className="flex-1 text-sm text-textPrimary min-w-0 truncate">{log.action}</p>
                    <span className="text-xs text-textSecondary whitespace-nowrap">{log.time}</span>
                  </div>
                );
              })}
            </div>
            <button className="text-sm text-primary hover:underline mt-4 block mx-auto">
              View All Logs
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
