'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setupRequired, setSetupRequired] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/setup', { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('تعذر التحقق من حالة الإعداد');
        return res.json();
      })
      .then((data) => setSetupRequired(Boolean(data.setupRequired)))
      .catch((err) => {
        setError(err.message);
        setSetupRequired(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (setupRequired && password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    const endpoint = setupRequired ? '/api/auth/setup' : '/api/auth/login';
    const payload = setupRequired
      ? { password, confirmPassword }
      : { username: 'admin', password };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      router.replace('/admin');
      router.refresh();
    } else if (body.setupRequired) {
      setSetupRequired(true);
      setError('أكمل إعداد كلمة المرور أولاً');
    } else {
      setError(body.error || (setupRequired ? 'تعذر إنشاء كلمة المرور' : 'كلمة المرور غير صحيحة'));
    }
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
          <h1 className="text-2xl font-extrabold">{setupRequired ? 'إعداد لوحة التحكم' : 'لوحة التحكم'}</h1>
          <p className="mt-1 text-sm opacity-80">
            {setupRequired ? 'أنشئ كلمة مرور آمنة للبدء' : 'سجّل الدخول للمتابعة'}
          </p>
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
              value="admin"
              readOnly
              className="w-full rounded-xl border border-[#E6D9C0] bg-[#EEE7DC] px-4 py-3 text-left text-[color:var(--muted)] outline-none"
              dir="ltr"
            />
          </div>

          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-bold text-[color:var(--brand-dark)]">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={setupRequired ? 8 : undefined}
              className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-3 text-right outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--accent-light)]"
              placeholder="••••••••"
            />
          </div>

          {setupRequired && (
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-bold text-[color:var(--brand-dark)]">تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-3 text-right outline-none transition focus:border-[color:var(--brand)] focus:bg-white focus:ring-4 focus:ring-[color:var(--accent-light)]"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-[color:var(--muted)]">8 أحرف على الأقل. اسم المستخدم ثابت: admin</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || setupRequired === null}
            className="w-full rounded-xl bg-[color:var(--brand)] px-5 py-3 font-bold text-white transition hover:bg-[color:var(--brand-dark)] disabled:opacity-60"
          >
            {loading
              ? (setupRequired ? 'جاري إنشاء الحساب...' : 'جاري الدخول...')
              : (setupRequired ? 'إنشاء كلمة المرور والمتابعة' : 'تسجيل الدخول')}
          </button>

          <p className="mt-4 text-center text-xs text-[color:var(--muted)]">
            {setupRequired ? 'لن تكون هناك كلمة مرور افتراضية.' : 'اسم المستخدم: admin'}
          </p>
        </form>
      </div>
    </div>
  );
}
