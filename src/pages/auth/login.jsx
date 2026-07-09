import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import logo from "../../assets/car-logo.png";
import { ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";

const DUMMY_EMAIL = "admin@gmail.com";
const DUMMY_PASSWORD = "123456";
const DUMMY_OTP = "000000";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState("credentials"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      setStep("otp");
    } else {
      setError("Invalid email or password.");
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (otp === DUMMY_OTP) {
      // const res = await fetch("/api/auth/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) });
      // const { user, token } = await res.json();
      const user = { name: "Admin", email, city: "Karachi" };
      const token = "dummy-token-123";

      login(user, token);
      navigate("/");
    } else {
      setError("Invalid verification code.");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-primary/80">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-10 lg:p-14 text-white w-full">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-11 h-11" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Car Rental</h1>
              <p className="text-xs text-white/60">Admin Panel</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Run your rental
              <br />
              business, city by city.
            </h2>
            <p className="text-white/70 max-w-md">
              Manage bookings, complaints, pricing, and your team — all from
              one secure control room, built for every branch you operate.
            </p>
          </div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Car Rental Platform. All rights reserved.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="flex md:hidden items-center gap-2 justify-center mb-8">
            <img src={logo} alt="logo" className="w-9 h-9" />
            <span className="font-bold text-textPrimary">Car Rental</span>
          </div>

          <div className="bg-surface p-6 sm:p-8 rounded-2xl shadow-card border border-borderColor">

            <div className="mb-6">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {step === "credentials" ? <Lock size={20} /> : <ShieldCheck size={20} />}
              </div>
              <h2 className="text-xl font-bold text-textPrimary">
                {step === "credentials" ? "Welcome back" : "Verify it's you"}
              </h2>
              <p className="text-sm text-textSecondary mt-1">
                {step === "credentials"
                  ? "Sign in to manage your rental business"
                  : `Enter the 6-digit code sent to ${email}`}
              </p>
            </div>

            {step === "credentials" ? (
              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-[34px] text-textSecondary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary">
                  Continue
                </Button>

                <p className="text-xs text-textSecondary text-center mt-2">
                  Demo credentials: <span className="text-textPrimary font-medium">admin@gmail.com</span> / <span className="text-textPrimary font-medium">123456</span>
                </p>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-xl p-3 text-sm">
                  <ShieldCheck size={18} className="shrink-0" />
                  Two-factor authentication is enabled for this account.
                </div>

                <Input
                  label="Verification Code"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                {error && (
                  <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary">
                  Verify &amp; Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setError("");
                  }}
                >
                  Back
                </Button>

                <p className="text-xs text-textSecondary text-center mt-1">
                  Demo code: <span className="text-textPrimary font-medium">000000</span>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}