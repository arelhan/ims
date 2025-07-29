"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Giriş denemesi:", { email, password: "***" });
      
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // redirect false yaparak hata mesajlarını yakalayalım
        callbackUrl: "/dashboard",
      });
      
      console.log("SignIn response:", res);
      
      if (res?.error) {
        setError(`Giriş başarısız: ${res.error}`);
        console.error("Login error:", res.error);
      } else if (res?.ok) {
        // Başarılı giriş, dashboard'a yönlendir
        window.location.href = "/dashboard";
      } else {
        setError("Bilinmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Login catch error:", error);
      setError("Bağlantı hatası oluştu.");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          IMS for IT Giriş
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">E-posta</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Şifre</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t" />
          <span className="mx-2 text-gray-400">veya</span>
          <div className="flex-grow border-t" />
        </div>
        <button
          className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <svg
            width="20"
            height="20"
            fill="currentColor"
            className="inline-block"
          >
            <g>
              <path
                d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.48c-.24 1.28-.97 2.36-2.07 3.09v2.56h3.35c1.96-1.81 3.09-4.48 3.09-7.44z"
                fill="#4285F4"
              />
              <path
                d="M10 20c2.7 0 4.97-.89 6.63-2.41l-3.35-2.56c-.93.62-2.12.99-3.28.99-2.52 0-4.66-1.7-5.42-3.99H1.13v2.5C2.86 17.98 6.18 20 10 20z"
                fill="#34A853"
              />
              <path
                d="M4.58 12.03A5.99 5.99 0 014 10c0-.7.12-1.38.34-2.03V5.47H1.13A9.99 9.99 0 000 10c0 1.64.39 3.19 1.13 4.53l3.45-2.5z"
                fill="#FBBC05"
              />
              <path
                d="M10 4c1.47 0 2.8.51 3.85 1.51l2.89-2.89C14.97 1.11 12.7 0 10 0 6.18 0 2.86 2.02 1.13 5.47l3.45 2.5C5.34 5.7 7.48 4 10 4z"
                fill="#EA4335"
              />
            </g>
          </svg>
          Google ile Giriş Yap
        </button>
      </div>
    </div>
  );
}
