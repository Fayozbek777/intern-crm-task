import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Copy,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { authApi } from "../../../api/Auth/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await authApi.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "qwe");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172b] text-white p-12 flex-col justify-center relative">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <span className="text-2xl font-bold">CorpCRM</span>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Manage your team with <br />
            <span className="text-blue-400">precision and clarity.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            One place for your people, their work and everything in between —
            employee records, task delegation and progress at a glance.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">Welcome back</h2>
          </div>
          <p className="text-gray-600 mb-8">
            Enter your details to sign in to your account.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none transition"
                placeholder="admin@corpcrm.dev"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f172b] focus:border-transparent outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172b] text-white py-2.5 rounded-lg hover:bg-[#1a2744] transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-gray-700">
                Demo accounts
              </span>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <span className="text-xs text-gray-400">Click to copy</span>
            </div>

            <div className="with-[950px] bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="font-medium text-gray-700 w-16">Admin:</span>
                <code className="text-[#0f172b] bg-white px-2 py-1 rounded border border-gray-200 text-xs flex-1 min-w-[150px]">
                  admin@corpcrm.dev
                </code>
                <button
                  onClick={() =>
                    copyToClipboard("admin@corpcrm.dev", "admin-email")
                  }
                  className="p-1.5 hover:bg-white rounded transition group"
                >
                  {copied === "admin-email" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                <span className="text-gray-300">·</span>
                <code className="text-[#0f172b] bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                  Admin123!
                </code>
                <button
                  onClick={() => copyToClipboard("Admin123!", "admin-pass")}
                  className="p-1.5 hover:bg-white rounded transition group"
                >
                  {copied === "admin-pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-17 text-sm flex-wrap">
                <span className="font-medium text-gray-700 w-16">
                  Employee:
                </span>
                <code className="text-[#0f172b] bg-white px-2 py-1 rounded border border-gray-200 text-xs flex-1 min-w-[150px]">
                  alice.freeman@corpcrm.dev
                </code>
                <button
                  onClick={() =>
                    copyToClipboard(
                      "alice.freeman@corpcrm.dev",
                      "employee-email",
                    )
                  }
                  className="p-1.5 hover:bg-white rounded transition group"
                >
                  {copied === "employee-email" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
                <span className="text-gray-300">·</span>
                <code className="text-[#0f172b] bg-white px-2 py-1 rounded border border-gray-200 text-xs">
                  Employee123!
                </code>
                <button
                  onClick={() =>
                    copyToClipboard("Employee123!", "employee-pass")
                  }
                  className="p-1.5 hover:bg-white rounded transition group"
                >
                  {copied === "employee-pass" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?
            <span className="text-[#0f172b] font-medium ml-[10px]">
              Contact your administrator.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
