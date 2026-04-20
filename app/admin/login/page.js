'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    setLoading(false);
    if (res.ok) router.push('/admin');
    else setError('اسم المستخدم أو كلمة المرور غير صحيحة');
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(1000px 600px at 20% 0%, #C9884A 0%, #8B5E34 40%, #3A2412 100%)'
      }}
    >
      <div className="w-full max-w-md fade-in">
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
          <p className="mt-1 text-sm opacity-80">يرجى تسجيل الدخول للمتابعة</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-7 shadow-2xl"
          style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
        >
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-bold text-[color:var(--brand-dark)]">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-3 text-right outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--accent-light)]"
              placeholder="admin"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-bold text-[color:var(--brand-dark)]">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-3 text-right outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--accent-light)]"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[color:var(--brand)] px-5 py-3 font-bold text-white transition hover:bg-[color:var(--brand-dark)] disabled:opacity-60"
          >
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          <p className="mt-4 text-center text-xs text-[color:var(--muted)]">
            الافتراضي: admin / password
          </p>
        </form>
      </div>
    </div>
  );
}
