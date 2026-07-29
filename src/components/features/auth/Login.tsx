import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Copy,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  Shield,
  Zap,
  Layers,
} from "lucide-react";
import { useAuth } from "../../../ctx/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "Email or password is incorrect",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@corpcrm.dev",
      password: "Admin123!",
      icon: Shield,
    },
    {
      role: "Employee",
      email: "alice.freeman@corpcrm.dev",
      password: "Employee123!",
      icon: Users,
    },
  ];

  const features = [
    { icon: Layers, text: "Employee Management" },
    { icon: Zap, text: "Task Tracking" },
    { icon: Sparkles, text: "Real-time Updates" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a1628] via-[#0f172b] to-[#1a2744] text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

        {/* Decorative dots */}
        <div className="absolute top-20 right-20 grid grid-cols-4 gap-2 opacity-10">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
          ))}
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-blue-500/10">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight">CorpCRM</span>
              <span className="block text-xs text-gray-400 font-light tracking-wider uppercase mt-0.5">
                Enterprise Suite
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Manage your team with <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              precision and clarity.
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            One place for your people, their work and everything in between —
            employee records, task delegation and progress at a glance.
          </p>

          <div className="flex flex-wrap gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5"
              >
                <feature.icon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#0f172b] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0f172b]">CorpCRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 animate-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] focus:bg-white outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="admin@corpcrm.dev"
                required
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0f172b]/20 focus:border-[#0f172b] focus:bg-white outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172b] text-white py-3 rounded-xl hover:bg-[#1a2744] transition-all duration-200 disabled:opacity-50 font-medium flex items-center justify-center gap-2 shadow-lg shadow-[#0f172b]/10 hover:shadow-[#0f172b]/20"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Demo Credentials
              </span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
              {demoAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center gap-19 text-sm flex-wrap p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0f172b]/5 flex items-center justify-center flex-shrink-0">
                    <account.icon className="w-4 h-4 text-[#0f172b]" />
                  </div>
                  <span className="font-medium text-gray-700 text-xs w-14">
                    {account.role}
                  </span>
                  <code className="text-[#0f172b] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs flex-1 min-w-[120px] font-mono truncate">
                    {account.email}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(account.email, `${account.role}-email`)
                    }
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition group flex-shrink-0"
                    title="Copy email"
                  >
                    {copied === `${account.role}-email` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                  <span className="text-gray-300 text-xs flex-shrink-0">·</span>
                  <code className="text-[#0f172b] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-mono flex-shrink-0">
                    {account.password}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(account.password, `${account.role}-pass`)
                    }
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition group flex-shrink-0"
                    title="Copy password"
                  >
                    {copied === `${account.role}-pass` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?
            <span className="ml-5 text-[#0f172b] font-semibold hover:underline cursor-pointer">
              Contact your administrator
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
