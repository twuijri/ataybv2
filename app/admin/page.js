'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SOCIAL_ICONS, SOCIAL_LABELS } from '../_components/SocialIcon';

const TABS = [
  { id: 'overview', label: 'نظرة عامة', icon: 'chart' },
  { id: 'links', label: 'الروابط', icon: 'link' },
  { id: 'social', label: 'السوشيال ميديا', icon: 'share' },
  { id: 'appearance', label: 'المظهر والخلفية', icon: 'palette' },
  { id: 'settings', label: 'إعدادات الموقع', icon: 'settings' },
  { id: 'account', label: 'الحساب', icon: 'user' }
];

const TabIcons = {
  chart: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><rect x="7" y="12" width="3" height="6" /><rect x="12" y="8" width="3" height="10" /><rect x="17" y="5" width="3" height="13" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2a10 10 0 1 0 6.9 17.2 1.5 1.5 0 0 0-1-2.6H16a2 2 0 0 1-2-2 2 2 0 0 1 1-1.7c1.8-1 3-2.9 3-5A6.5 6.5 0 0 0 12 2Z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  )
};

function Card({ children, className = '' }) {
  return <div className={`rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>;
}

function StatCard({ label, value, hint, tone = 'brand' }) {
  const tones = {
    brand: 'from-[#8B5E34] to-[#5C3A1E]',
    accent: 'from-[#D4A95A] to-[#B8892F]',
    green: 'from-emerald-500 to-emerald-700',
    blue: 'from-sky-500 to-indigo-700'
  };
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tones[tone]} p-5 text-white shadow-lg`}>
      <div className="text-xs font-medium opacity-80">{label}</div>
      <div className="mt-1 text-3xl font-extrabold tracking-tight">{value}</div>
      {hint && <div className="mt-1 text-xs opacity-80">{hint}</div>}
      <div className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-white/10" />
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[color:var(--brand-dark)] px-5 py-2.5 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}

function useUpload() {
  return async (file, kind = 'image') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('kind', kind);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) throw new Error((await res.json()).error || 'فشل الرفع');
    return res.json();
  };
}

function Overview({ stats }) {
  const max = Math.max(1, ...(stats?.chart || []).map(c => Math.max(c.views, c.clicks)));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="مشاهدات الصفحة" value={stats?.pageViews ?? 0} tone="brand" />
        <StatCard label="نقرات الروابط" value={stats?.linkClicks ?? 0} tone="accent" />
        <StatCard label="عدد الروابط" value={stats?.linkCount ?? 0} tone="blue" />
        <StatCard label="معدل التحويل" value={`${stats?.conversion ?? 0}%`} tone="green" />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[color:var(--brand-dark)]">آخر 7 أيام</h3>
          <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[color:var(--brand)]" /> مشاهدات</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" /> نقرات</span>
          </div>
        </div>
        <div className="flex h-48 items-end gap-3" dir="ltr">
          {(stats?.chart || []).map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end gap-1">
                <div className="flex-1 rounded-t-lg bg-[color:var(--brand)] transition-all" style={{ height: `${(d.views / max) * 100}%`, minHeight: d.views ? 4 : 0 }} title={`مشاهدات: ${d.views}`} />
                <div className="flex-1 rounded-t-lg bg-[color:var(--accent)] transition-all" style={{ height: `${(d.clicks / max) * 100}%`, minHeight: d.clicks ? 4 : 0 }} title={`نقرات: ${d.clicks}`} />
              </div>
              <div className="text-[10px] text-[color:var(--muted)]">{d.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">الروابط الأكثر نقراً</h3>
        {!stats?.topLinks?.length ? (
          <div className="py-8 text-center text-sm text-[color:var(--muted)]">لا توجد بيانات بعد</div>
        ) : (
          <div className="space-y-2">
            {stats.topLinks.map((l, i) => (
              <div key={l.id} className="flex items-center gap-3 rounded-xl bg-[color:var(--surface)] px-4 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--brand)] text-xs font-bold text-white">{i + 1}</span>
                <span className="flex-1 font-medium">{l.title}</span>
                <span className="text-sm font-bold text-[color:var(--brand)]">{l.clicks || 0} نقرة</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LinksTab({ links, reload, toast }) {
  const upload = useUpload();
  const [form, setForm] = useState({
    title: '', title_en: '', url: '', icon: '', color: '', colorOpacity: 1,
    isGroup: false, parentId: '', tagline: '', tagline_en: '',
    linkType: 'general', appStoreUrl: '', playStoreUrl: ''
  });
  const groups = links.filter(l => l.isGroup);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [uploading, setUploading] = useState(false);
  const draggingId = useRef(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      parentId: form.parentId === '' ? null : parseInt(form.parentId)
    };
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setForm({
        title: '', title_en: '', url: '', icon: '', color: '', colorOpacity: 1,
        isGroup: false, parentId: '', tagline: '', tagline_en: '',
        linkType: 'general', appStoreUrl: '', playStoreUrl: ''
      });
      toast('تمت الإضافة');
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('حذف هذا الرابط؟')) return;
    await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
    toast('تم الحذف');
    reload();
  };

  const saveEdit = async () => {
    const payload = {
      id: editingId,
      ...editDraft,
      parentId: editDraft.parentId === '' || editDraft.parentId == null ? null : parseInt(editDraft.parentId)
    };
    await fetch('/api/links', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    setEditingId(null);
    toast('تم التحديث');
    reload();
  };

  const handleIconUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const r = await upload(file, 'image');
      if (target === 'new') setForm(f => ({ ...f, icon: r.url }));
      else setEditDraft(d => ({ ...d, icon: r.url }));
    } catch (err) { toast(err.message); }
    setUploading(false);
  };

  const onDragStart = (id) => (draggingId.current = id);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (targetId) => {
    if (draggingId.current == null || draggingId.current === targetId) return;
    const ids = links.map(l => l.id);
    const from = ids.indexOf(draggingId.current);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    await fetch('/api/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, type: 'links' })
    });
    draggingId.current = null;
    reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">إضافة رابط جديد</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-wrap items-center gap-4 rounded-xl bg-[color:var(--surface)] p-3 ring-1 ring-black/5">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={form.isGroup}
                onChange={e => setForm({ ...form, isGroup: e.target.checked, parentId: e.target.checked ? '' : form.parentId })}
                className="h-4 w-4 accent-[color:var(--brand)]" />
              قسم/فرع (يفتح صفحة فرعية)
            </label>
            {!form.isGroup && groups.length > 0 && (
              <label className="flex items-center gap-2 text-sm">
                <span className="font-bold">ضمن قسم:</span>
                <select value={form.parentId} onChange={e => setForm({ ...form, parentId: e.target.value })}
                  className="rounded-lg border border-[#E6D9C0] bg-white px-3 py-1.5 text-sm">
                  <option value="">— بلا قسم (الصفحة الرئيسية) —</option>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
              </label>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-bold">الاسم</label>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="min-w-[34px] rounded bg-[color:var(--accent-light)] px-2 py-1 text-center text-[10px] font-bold text-[color:var(--brand-dark)]">AR</span>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]"
                  placeholder={form.isGroup ? 'مثلاً: فروع الرياض' : 'مثلاً: هنقرستيشن'} />
              </div>
              <div className="flex items-center gap-2">
                <span className="min-w-[34px] rounded bg-[color:var(--brand)] px-2 py-1 text-center text-[10px] font-bold text-white">EN</span>
                <input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })}
                  className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]"
                  placeholder={form.isGroup ? 'e.g. Riyadh Branches' : 'e.g. HungerStation'} dir="ltr" />
              </div>
            </div>
          </div>

          {form.isGroup ? (
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-bold">وصف القسم (اختياري)</label>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="min-w-[34px] rounded bg-[color:var(--accent-light)] px-2 py-1 text-center text-[10px] font-bold text-[color:var(--brand-dark)]">AR</span>
                  <input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                    className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]"
                    placeholder="يظهر أسفل عنوان الصفحة الفرعية" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="min-w-[34px] rounded bg-[color:var(--brand)] px-2 py-1 text-center text-[10px] font-bold text-white">EN</span>
                  <input value={form.tagline_en} onChange={e => setForm({ ...form, tagline_en: e.target.value })}
                    className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]"
                    placeholder="Appears under subpage title" dir="ltr" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="md:col-span-2 flex flex-wrap items-center gap-2 rounded-xl bg-[color:var(--surface)] p-3 ring-1 ring-black/5">
                <span className="text-sm font-bold">نوع الرابط:</span>
                <div className="flex gap-1 rounded-lg bg-white p-1 ring-1 ring-[#E6D9C0]">
                  <button type="button" onClick={() => setForm({ ...form, linkType: 'general' })}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition ${form.linkType === 'general' ? 'bg-[color:var(--brand)] text-white' : 'text-[color:var(--muted)]'}`}>
                    🔗 رابط عام
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, linkType: 'app' })}
                    className={`rounded-md px-3 py-1 text-xs font-bold transition ${form.linkType === 'app' ? 'bg-[color:var(--brand)] text-white' : 'text-[color:var(--muted)]'}`}>
                    📱 تطبيق (ذكي)
                  </button>
                </div>
                {form.linkType === 'app' && (
                  <span className="text-xs text-[color:var(--muted)]">يوجّه المستخدم تلقائياً للمتجر حسب نوع جهازه</span>
                )}
              </div>

              {form.linkType === 'general' ? (
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-bold">الرابط</label>
                  <input required type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                    className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]"
                    placeholder="https://..." dir="ltr" />
                </div>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-bold"> رابط App Store (iOS)</label>
                    <input type="url" value={form.appStoreUrl} onChange={e => setForm({ ...form, appStoreUrl: e.target.value })}
                      className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]"
                      placeholder="https://apps.apple.com/..." dir="ltr" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold"> رابط Google Play (Android)</label>
                    <input type="url" value={form.playStoreUrl} onChange={e => setForm({ ...form, playStoreUrl: e.target.value })}
                      className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]"
                      placeholder="https://play.google.com/..." dir="ltr" />
                  </div>
                </>
              )}
            </>
          )}
          <div>
            <label className="mb-1 block text-sm font-bold">الأيقونة</label>
            <div className="flex items-center gap-2">
              {form.icon && <img src={form.icon} className="h-10 w-10 rounded-lg object-contain ring-1 ring-black/10" alt="" />}
              <label className="cursor-pointer rounded-xl bg-[color:var(--accent)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[color:var(--accent)]/80">
                {uploading ? 'جاري...' : 'رفع صورة'}
                <input type="file" accept="image/*" className="hidden" onChange={e => handleIconUpload(e, 'new')} />
              </label>
              <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-xs text-left outline-none"
                placeholder="أو رابط للأيقونة" dir="ltr" />
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">المقاس المفضّل: 128×128 بكسل مربعة (PNG شفاف)</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">لون الزر (اختياري)</label>
            <div className="flex items-center gap-2">
              <input type="color" value={form.color || '#ffffff'} onChange={e => setForm({ ...form, color: e.target.value })}
                className="h-11 w-14 cursor-pointer rounded-lg border border-[#E6D9C0]" />
              <input value={form.color || ''} onChange={e => setForm({ ...form, color: e.target.value })}
                className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-sm outline-none" placeholder="افتراضي (أبيض)" />
              {form.color && <button type="button" onClick={() => setForm({ ...form, color: '' })} className="text-xs text-[color:var(--muted)] underline">مسح</button>}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label className="min-w-fit text-xs text-[color:var(--muted)]">شفافية: {Math.round((form.colorOpacity ?? 1) * 100)}%</label>
              <input type="range" min="0.1" max="1" step="0.05" value={form.colorOpacity ?? 1}
                onChange={e => setForm({ ...form, colorOpacity: parseFloat(e.target.value) })}
                className="flex-1 accent-[color:var(--brand)]" />
            </div>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="rounded-xl bg-[color:var(--brand)] px-6 py-2.5 font-bold text-white hover:bg-[color:var(--brand-dark)]">
              + إضافة رابط
            </button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[color:var(--brand-dark)]">الروابط الحالية</h3>
          <span className="text-xs text-[color:var(--muted)]">اسحب الصفوف لإعادة الترتيب</span>
        </div>
        {links.length === 0 ? (
          <div className="py-10 text-center text-sm text-[color:var(--muted)]">لا توجد روابط. أضف واحداً من الأعلى.</div>
        ) : (
          <div className="space-y-2">
            {links.map(l => {
              const editing = editingId === l.id;
              const parent = l.parentId ? links.find(x => x.id === l.parentId) : null;
              return (
                <div
                  key={l.id}
                  draggable={!editing}
                  onDragStart={() => onDragStart(l.id)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(l.id)}
                  className={`flex items-center gap-3 rounded-xl p-3 ring-1 ring-black/5 ${l.isGroup ? 'bg-[color:var(--accent-light)]/50' : 'bg-[color:var(--surface)]'} ${parent ? 'mr-6' : ''}`}
                >
                  <span className="drag-handle text-[color:var(--muted)]">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>
                  </span>
                  {l.icon ? (
                    <img src={l.icon} alt="" className="h-10 w-10 rounded-lg object-contain bg-white ring-1 ring-black/5" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--accent-light)] text-lg">🔗</div>
                  )}
                  {editing ? (
                    <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                      <div className="md:col-span-2 flex flex-wrap items-center gap-3 rounded-lg bg-white/70 p-2 text-xs">
                        <label className="flex cursor-pointer items-center gap-1.5 font-bold">
                          <input type="checkbox" checked={!!editDraft.isGroup}
                            onChange={e => setEditDraft({ ...editDraft, isGroup: e.target.checked, parentId: e.target.checked ? '' : editDraft.parentId })}
                            className="h-3.5 w-3.5 accent-[color:var(--brand)]" />
                          قسم
                        </label>
                        {!editDraft.isGroup && (
                          <label className="flex items-center gap-1.5">
                            <span className="font-bold">ضمن:</span>
                            <select value={editDraft.parentId ?? ''} onChange={e => setEditDraft({ ...editDraft, parentId: e.target.value })}
                              className="rounded border border-[#E6D9C0] bg-white px-2 py-1 text-xs">
                              <option value="">— بلا قسم —</option>
                              {groups.filter(g => g.id !== l.id).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                            </select>
                          </label>
                        )}
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <span className="min-w-[26px] rounded bg-[color:var(--accent-light)] px-1.5 py-0.5 text-center text-[10px] font-bold">AR</span>
                        <input value={editDraft.title || ''} onChange={e => setEditDraft({ ...editDraft, title: e.target.value })} placeholder="الاسم" className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm outline-none" />
                      </div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <span className="min-w-[26px] rounded bg-[color:var(--brand)] px-1.5 py-0.5 text-center text-[10px] font-bold text-white">EN</span>
                        <input value={editDraft.title_en || ''} onChange={e => setEditDraft({ ...editDraft, title_en: e.target.value })} placeholder="Name (English)" className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm text-left outline-none" dir="ltr" />
                      </div>
                      {editDraft.isGroup ? (
                        <>
                          <div className="md:col-span-2 flex items-center gap-2">
                            <span className="min-w-[26px] rounded bg-[color:var(--accent-light)] px-1.5 py-0.5 text-center text-[10px] font-bold">AR</span>
                            <input value={editDraft.tagline || ''} onChange={e => setEditDraft({ ...editDraft, tagline: e.target.value })} placeholder="وصف القسم" className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm outline-none" />
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2">
                            <span className="min-w-[26px] rounded bg-[color:var(--brand)] px-1.5 py-0.5 text-center text-[10px] font-bold text-white">EN</span>
                            <input value={editDraft.tagline_en || ''} onChange={e => setEditDraft({ ...editDraft, tagline_en: e.target.value })} placeholder="Tagline" className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm text-left outline-none" dir="ltr" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="md:col-span-2 flex items-center gap-2 rounded-lg bg-white/70 p-1.5 text-xs">
                            <span className="font-bold">النوع:</span>
                            <button type="button" onClick={() => setEditDraft({ ...editDraft, linkType: 'general' })}
                              className={`rounded px-2 py-0.5 ${(editDraft.linkType || 'general') === 'general' ? 'bg-[color:var(--brand)] text-white' : ''}`}>عام</button>
                            <button type="button" onClick={() => setEditDraft({ ...editDraft, linkType: 'app' })}
                              className={`rounded px-2 py-0.5 ${editDraft.linkType === 'app' ? 'bg-[color:var(--brand)] text-white' : ''}`}>تطبيق</button>
                          </div>
                          {(editDraft.linkType || 'general') === 'general' ? (
                            <input value={editDraft.url || ''} onChange={e => setEditDraft({ ...editDraft, url: e.target.value })} placeholder="الرابط" className="md:col-span-2 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm text-left outline-none" dir="ltr" />
                          ) : (
                            <>
                              <input value={editDraft.appStoreUrl || ''} onChange={e => setEditDraft({ ...editDraft, appStoreUrl: e.target.value })} placeholder="App Store URL (iOS)" className="rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm text-left outline-none" dir="ltr" />
                              <input value={editDraft.playStoreUrl || ''} onChange={e => setEditDraft({ ...editDraft, playStoreUrl: e.target.value })} placeholder="Play Store URL (Android)" className="rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-sm text-left outline-none" dir="ltr" />
                            </>
                          )}
                        </>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer rounded-lg bg-[color:var(--accent)] px-3 py-2 text-xs font-bold text-white">
                          رفع أيقونة
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleIconUpload(e, 'edit')} />
                        </label>
                        <input value={editDraft.icon || ''} onChange={e => setEditDraft({ ...editDraft, icon: e.target.value })} className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-xs text-left outline-none" dir="ltr" placeholder="رابط الأيقونة" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <input type="color" value={editDraft.color || '#ffffff'} onChange={e => setEditDraft({ ...editDraft, color: e.target.value })} className="h-9 w-12 rounded-lg border border-[#E6D9C0]" />
                          <input value={editDraft.color || ''} onChange={e => setEditDraft({ ...editDraft, color: e.target.value })} className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-2 text-xs outline-none" placeholder="لون الزر" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="min-w-fit text-[10px] text-[color:var(--muted)]">شفافية: {Math.round((editDraft.colorOpacity ?? 1) * 100)}%</span>
                          <input type="range" min="0.1" max="1" step="0.05"
                            value={editDraft.colorOpacity ?? 1}
                            onChange={e => setEditDraft({ ...editDraft, colorOpacity: parseFloat(e.target.value) })}
                            className="flex-1 accent-[color:var(--brand)]" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[color:var(--brand-dark)]">{l.title}</span>
                        {l.isGroup && (
                          <span className="rounded-full bg-[color:var(--brand)] px-2 py-0.5 text-[10px] font-bold text-white">قسم</span>
                        )}
                        {parent && (
                          <span className="rounded-full bg-[color:var(--muted)]/20 px-2 py-0.5 text-[10px] text-[color:var(--muted)]">في: {parent.title}</span>
                        )}
                      </div>
                      <div className="text-xs text-[color:var(--muted)] truncate" dir="ltr">
                        {l.isGroup ? (l.tagline || `يفتح ${links.filter(x => x.parentId === l.id).length} روابط فرعية`) : l.url}
                      </div>
                    </div>
                  )}
                  <div className="hidden text-center md:block">
                    <div className="text-lg font-bold text-[color:var(--brand)]">{l.clicks || 0}</div>
                    <div className="text-[10px] text-[color:var(--muted)]">نقرات</div>
                  </div>
                  <div className="flex gap-1.5">
                    {editing ? (
                      <>
                        <button onClick={saveEdit} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700">حفظ</button>
                        <button onClick={() => setEditingId(null)} className="rounded-lg bg-gray-200 px-3 py-2 text-xs font-bold text-gray-700">إلغاء</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(l.id); setEditDraft({
                          title: l.title, title_en: l.title_en || '',
                          url: l.url || '', icon: l.icon || '',
                          color: l.color || '', colorOpacity: l.colorOpacity ?? 1,
                          isGroup: !!l.isGroup, parentId: l.parentId ?? '',
                          tagline: l.tagline || '', tagline_en: l.tagline_en || '',
                          linkType: l.linkType || 'general',
                          appStoreUrl: l.appStoreUrl || '', playStoreUrl: l.playStoreUrl || ''
                        }); }} className="rounded-lg bg-[color:var(--brand)] px-3 py-2 text-xs font-bold text-white hover:bg-[color:var(--brand-dark)]">تعديل</button>
                        <button onClick={() => handleDelete(l.id)} className="rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600">حذف</button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function SocialTab({ social, reload, toast }) {
  const [platform, setPlatform] = useState('instagram');
  const [url, setUrl] = useState('');
  const draggingId = useRef(null);

  const add = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/social', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, url })
    });
    if (res.ok) { setUrl(''); toast('تمت الإضافة'); reload(); }
  };

  const del = async (id) => {
    if (!confirm('حذف؟')) return;
    await fetch(`/api/social?id=${id}`, { method: 'DELETE' });
    reload();
  };

  const update = async (s, patch) => {
    await fetch('/api/social', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, ...patch }) });
    reload();
  };

  const onDragStart = (id) => (draggingId.current = id);
  const onDrop = async (targetId) => {
    if (draggingId.current == null || draggingId.current === targetId) return;
    const ids = social.map(s => s.id);
    const from = ids.indexOf(draggingId.current);
    const to = ids.indexOf(targetId);
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    await fetch('/api/reorder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids, type: 'social' }) });
    draggingId.current = null;
    reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">إضافة حساب سوشيال</h3>
        <form onSubmit={add} className="flex flex-col gap-3 md:flex-row">
          <select value={platform} onChange={e => setPlatform(e.target.value)}
            className="rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]">
            {Object.keys(SOCIAL_LABELS).map(k => <option key={k} value={k}>{SOCIAL_LABELS[k]}</option>)}
          </select>
          <input required type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://instagram.com/username"
            className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]" dir="ltr" />
          <button className="rounded-xl bg-[color:var(--brand)] px-6 py-2.5 font-bold text-white hover:bg-[color:var(--brand-dark)]">+ إضافة</button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">الحسابات</h3>
        {social.length === 0 ? (
          <div className="py-10 text-center text-sm text-[color:var(--muted)]">لا توجد حسابات بعد</div>
        ) : (
          <div className="space-y-2">
            {social.map(s => (
              <div
                key={s.id}
                draggable
                onDragStart={() => onDragStart(s.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(s.id)}
                className="flex items-center gap-3 rounded-xl bg-[color:var(--surface)] p-3 ring-1 ring-black/5"
              >
                <span className="drag-handle flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--brand-dark)] text-white">
                  <span className="w-5 h-5">{SOCIAL_ICONS[s.platform] || SOCIAL_ICONS.link}</span>
                </span>
                <select value={s.platform} onChange={e => update(s, { platform: e.target.value })} className="rounded-lg border border-[#E6D9C0] bg-white px-2 py-1.5 text-sm">
                  {Object.keys(SOCIAL_LABELS).map(k => <option key={k} value={k}>{SOCIAL_LABELS[k]}</option>)}
                </select>
                <input value={s.url} onChange={e => update(s, { url: e.target.value })} className="flex-1 rounded-lg border border-[#E6D9C0] bg-white px-3 py-1.5 text-sm text-left outline-none" dir="ltr" />
                <button onClick={() => del(s.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600">حذف</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function AppearanceTab({ config, setConfig, save, toast }) {
  const upload = useUpload();
  const [uploadingVid, setUploadingVid] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const onVideo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVid(true);
    try {
      const r = await upload(file, 'video');
      setConfig({ ...config, backgroundVideo: r.url });
      toast('تم رفع الفيديو');
    } catch (err) { toast(err.message); }
    setUploadingVid(false);
  };

  const onLogo = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const r = await upload(file, 'image');
      setConfig({ ...config, siteLogo: r.url });
      toast('تم رفع الشعار');
    } catch (err) { toast(err.message); }
    setUploadingLogo(false);
  };

  const onBgImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const r = await upload(file, 'image');
      setConfig({ ...config, backgroundImage: r.url });
      toast('تم رفع الصورة');
    } catch (err) { toast(err.message); }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">فيديو الخلفية (يعمل Loop)</h3>
        <p className="mb-4 text-sm text-[color:var(--muted)]">ارفع مقطع فيديو قصير ليعمل خلفية الصفحة الرئيسية. الأقصى 50 ميغا، صيغ MP4/WebM.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-[color:var(--accent)] bg-[color:var(--surface)] p-6 text-center transition hover:bg-[color:var(--accent-light)]/40">
              <svg viewBox="0 0 24 24" width="32" height="32" className="mx-auto mb-2 text-[color:var(--brand)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
              <div className="font-bold text-[color:var(--brand-dark)]">{uploadingVid ? 'جاري الرفع...' : 'رفع فيديو خلفية'}</div>
              <div className="mt-1 text-xs text-[color:var(--muted)]">MP4 / WebM — حتى 50MB</div>
              <div className="mt-0.5 text-xs text-[color:var(--muted)]">المقاس المفضّل: 1080×1920 عمودي، مدة 10–20 ثانية، 30fps، بدون صوت</div>
              <input type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={onVideo} />
            </label>
            {config.backgroundVideo && (
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className="truncate text-[color:var(--muted)]" dir="ltr">{config.backgroundVideo}</span>
                <button onClick={() => setConfig({ ...config, backgroundVideo: null })} className="text-red-600 underline">إزالة</button>
              </div>
            )}
          </div>
          <div>
            {config.backgroundVideo ? (
              <video src={config.backgroundVideo} autoPlay loop muted playsInline className="h-48 w-full rounded-2xl object-cover ring-1 ring-black/10" />
            ) : (
              <div className="flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#C9884A] to-[#3A2412] text-sm text-white/80 ring-1 ring-black/10">معاينة الخلفية</div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold">صورة خلفية بديلة (اختياري)</label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer rounded-xl bg-[color:var(--accent)] px-4 py-2.5 text-sm font-bold text-white">
                رفع صورة
                <input type="file" accept="image/*" className="hidden" onChange={onBgImage} />
              </label>
              {config.backgroundImage && (
                <>
                  <img src={config.backgroundImage} className="h-11 w-16 rounded-lg object-cover ring-1 ring-black/10" />
                  <button onClick={() => setConfig({ ...config, backgroundImage: null })} className="text-xs text-red-600 underline">إزالة</button>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-[color:var(--muted)]">المقاس المفضّل: 1080×1920 بكسل (عمودي للجوال) — تُستخدم كـ poster للفيديو</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">شدة التعتيم: {Math.round((config.overlayOpacity || 0) * 100)}%</label>
            <input type="range" min="0" max="1" step="0.05" value={config.overlayOpacity ?? 0.55}
              onChange={e => setConfig({ ...config, overlayOpacity: parseFloat(e.target.value) })}
              className="w-full accent-[color:var(--brand)]" />
            <p className="mt-1 text-xs text-[color:var(--muted)]">يتحكم بوضوح الفيديو خلف المحتوى</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">المربع الزجاجي</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-bold">شفافية المربع: {Math.round((config.glassOpacity ?? 0.1) * 100)}%</label>
            <input type="range" min="0" max="0.6" step="0.01" value={config.glassOpacity ?? 0.1}
              onChange={e => setConfig({ ...config, glassOpacity: parseFloat(e.target.value) })}
              className="w-full accent-[color:var(--brand)]" />
            <p className="mt-1 text-xs text-[color:var(--muted)]">0% = شفاف تماماً، 60% = واضح</p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">شدة الضبابية: {config.glassBlur ?? 18}px</label>
            <input type="range" min="0" max="40" step="1" value={config.glassBlur ?? 18}
              onChange={e => setConfig({ ...config, glassBlur: parseInt(e.target.value) })}
              className="w-full accent-[color:var(--brand)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">حدود المربع: {Math.round((config.glassBorderOpacity ?? 0.22) * 100)}%</label>
            <input type="range" min="0" max="1" step="0.02" value={config.glassBorderOpacity ?? 0.22}
              onChange={e => setConfig({ ...config, glassBorderOpacity: parseFloat(e.target.value) })}
              className="w-full accent-[color:var(--brand)]" />
          </div>
        </div>

        <div
          className="mt-5 flex h-28 items-center justify-center rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, #C9884A, #3A2412)'
          }}
        >
          <div
            className="flex h-20 w-64 items-center justify-center rounded-2xl text-sm font-bold text-white"
            style={{
              background: `rgba(255,255,255,${config.glassOpacity ?? 0.1})`,
              backdropFilter: `blur(${config.glassBlur ?? 18}px) saturate(140%)`,
              WebkitBackdropFilter: `blur(${config.glassBlur ?? 18}px) saturate(140%)`,
              border: `1px solid rgba(255,255,255,${config.glassBorderOpacity ?? 0.22})`
            }}
          >
            معاينة المربع الزجاجي
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">الشعار</h3>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--surface)] ring-1 ring-black/10">
            {config.siteLogo ? (
              <img src={config.siteLogo} className="h-full w-full object-cover" alt="" />
            ) : (
              <span className="text-xs text-[color:var(--muted)]">بدون شعار</span>
            )}
          </div>
          <label className="cursor-pointer rounded-xl bg-[color:var(--brand)] px-5 py-2.5 font-bold text-white hover:bg-[color:var(--brand-dark)]">
            {uploadingLogo ? 'جاري الرفع...' : 'رفع شعار'}
            <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
          </label>
          {config.siteLogo && (
            <button onClick={() => setConfig({ ...config, siteLogo: null })} className="text-sm text-red-600 underline">إزالة</button>
          )}
        </div>
        <p className="mt-3 text-xs text-[color:var(--muted)]">المقاس المفضّل: 512×512 بكسل مربعة (PNG شفاف)</p>
      </Card>

      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">الألوان</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-bold">لون البراند</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.brandColor || '#8B5E34'} onChange={e => setConfig({ ...config, brandColor: e.target.value })} className="h-11 w-14 rounded-lg border border-[#E6D9C0]" />
              <input value={config.brandColor || ''} onChange={e => setConfig({ ...config, brandColor: e.target.value })} className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">اللون المميز</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.accentColor || '#D4A95A'} onChange={e => setConfig({ ...config, accentColor: e.target.value })} className="h-11 w-14 rounded-lg border border-[#E6D9C0]" />
              <input value={config.accentColor || ''} onChange={e => setConfig({ ...config, accentColor: e.target.value })} className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">لون النص</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.textColor || '#F7EFE2'} onChange={e => setConfig({ ...config, textColor: e.target.value })} className="h-11 w-14 rounded-lg border border-[#E6D9C0]" />
              <input value={config.textColor || ''} onChange={e => setConfig({ ...config, textColor: e.target.value })} className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1 block text-sm font-bold">انحناء الأزرار: {config.buttonRadius ?? 14}px</label>
          <input type="range" min="0" max="32" step="1" value={config.buttonRadius ?? 14} onChange={e => setConfig({ ...config, buttonRadius: parseInt(e.target.value) })} className="w-full accent-[color:var(--brand)]" />
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} className="rounded-xl bg-[color:var(--brand)] px-8 py-3 font-bold text-white shadow-lg hover:bg-[color:var(--brand-dark)]">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}

function BilingualField({ label, arKey, config, setConfig, placeholderAr = '', placeholderEn = '' }) {
  const enKey = arKey + '_en';
  return (
    <div>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="min-w-[34px] rounded bg-[color:var(--accent-light)] px-2 py-1 text-center text-[10px] font-bold text-[color:var(--brand-dark)]">AR</span>
          <input value={config[arKey] || ''} onChange={e => setConfig({ ...config, [arKey]: e.target.value })}
            placeholder={placeholderAr}
            className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="min-w-[34px] rounded bg-[color:var(--brand)] px-2 py-1 text-center text-[10px] font-bold text-white">EN</span>
          <input value={config[enKey] || ''} onChange={e => setConfig({ ...config, [enKey]: e.target.value })}
            placeholder={placeholderEn} dir="ltr"
            className="flex-1 rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 text-left outline-none focus:border-[color:var(--brand)]" />
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ config, setConfig, save }) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">معلومات الموقع (عربي / إنجليزي)</h3>
        <p className="mb-4 text-xs text-[color:var(--muted)]">إذا تركت الحقل الإنجليزي فارغاً، سيُعرض النص العربي كبديل</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <BilingualField label="عنوان الموقع" arKey="siteTitle" config={config} setConfig={setConfig}
            placeholderAr="اطلب الحين" placeholderEn="Order Now" />
          <BilingualField label="وصف قصير" arKey="siteTagline" config={config} setConfig={setConfig}
            placeholderAr="اختر تطبيق التوصيل المفضل" placeholderEn="Pick your favorite delivery app" />
          <div className="md:col-span-2">
            <BilingualField label="نص الفوتر" arKey="footerText" config={config} setConfig={setConfig}
              placeholderAr="© 2026 جميع الحقوق محفوظة" placeholderEn="© 2026 All rights reserved" />
          </div>
        </div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button onClick={save} className="rounded-xl bg-[color:var(--brand)] px-8 py-3 font-bold text-white shadow-lg hover:bg-[color:var(--brand-dark)]">
          حفظ التغييرات
        </button>
      </div>
    </div>
  );
}

function AccountTab({ toast }) {
  const [form, setForm] = useState({ currentPassword: '', newUsername: '', newPassword: '' });

  useEffect(() => {
    fetch('/api/account').then(r => r.json()).then(d => { setForm(f => ({ ...f, newUsername: d.adminUsername || '' })); });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/account', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      toast('تم تحديث الحساب');
      setForm({ ...form, currentPassword: '', newPassword: '' });
    } else {
      const j = await res.json();
      toast(j.error || 'فشل التحديث');
    }
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-bold text-[color:var(--brand-dark)]">تغيير بيانات الدخول</h3>
      <form onSubmit={save} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-bold">كلمة المرور الحالية</label>
          <input required type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })}
            className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-bold">اسم المستخدم الجديد</label>
            <input value={form.newUsername} onChange={e => setForm({ ...form, newUsername: e.target.value })}
              className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">كلمة مرور جديدة (اختياري)</label>
            <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })}
              className="w-full rounded-xl border border-[#E6D9C0] bg-[color:var(--surface)] px-4 py-2.5 outline-none focus:border-[color:var(--brand)]" />
          </div>
        </div>
        <button className="rounded-xl bg-[color:var(--brand)] px-6 py-2.5 font-bold text-white hover:bg-[color:var(--brand-dark)]">حفظ</button>
      </form>
    </Card>
  );
}

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [social, setSocial] = useState([]);
  const [config, setConfig] = useState(null);
  const [stats, setStats] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const reload = async () => {
    const [l, s, c, st] = await Promise.all([
      fetch('/api/links').then(r => r.json()),
      fetch('/api/social').then(r => r.json()),
      fetch('/api/config').then(r => r.json()),
      fetch('/api/stats').then(r => r.json())
    ]);
    setLinks(Array.isArray(l) ? l : []);
    setSocial(Array.isArray(s) ? s : []);
    setConfig(c);
    setStats(st);
  };

  useEffect(() => { reload(); }, []);

  const saveConfig = async () => {
    await fetch('/api/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    setToastMsg('تم الحفظ');
    reload();
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const currentTab = useMemo(() => TABS.find(t => t.id === tab), [tab]);

  if (!config) {
    return <div className="flex min-h-screen items-center justify-center text-[color:var(--muted)]">جاري التحميل...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)]">
      {/* Mobile backdrop */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 flex w-72 flex-col bg-[color:var(--brand-dark)] text-white transition-transform md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="border-b border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--brand)] text-lg font-bold">
              {(config.siteTitle || 'A').slice(0, 1)}
            </div>
            <div>
              <div className="text-sm opacity-70">لوحة التحكم</div>
              <div className="font-bold">{config.siteTitle}</div>
            </div>
          </div>
        </div>

        <nav className="admin-scroll flex-1 overflow-y-auto p-3">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSidebarOpen(false); }}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right transition ${tab === t.id ? 'bg-[color:var(--brand)] font-bold' : 'text-white/80 hover:bg-white/10'}`}
            >
              <span>{TabIcons[t.icon]}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/80 hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            عرض الموقع
          </a>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-red-200 hover:bg-red-500/20">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur md:px-8">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-[color:var(--brand-dark)] hover:bg-[color:var(--accent-light)]/50 md:hidden">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-[color:var(--brand-dark)]">{currentTab?.label}</h1>
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-xl bg-[color:var(--accent-light)]/60 px-4 py-2 text-sm font-bold text-[color:var(--brand-dark)] hover:bg-[color:var(--accent-light)] md:flex">
            معاينة الموقع
          </a>
        </header>

        <main className="admin-scroll flex-1 overflow-y-auto p-4 md:p-8">
          <div className="fade-in mx-auto max-w-5xl">
            {tab === 'overview' && <Overview stats={stats} />}
            {tab === 'links' && <LinksTab links={links} reload={reload} toast={setToastMsg} />}
            {tab === 'social' && <SocialTab social={social} reload={reload} toast={setToastMsg} />}
            {tab === 'appearance' && <AppearanceTab config={config} setConfig={setConfig} save={saveConfig} toast={setToastMsg} />}
            {tab === 'settings' && <SettingsTab config={config} setConfig={setConfig} save={saveConfig} />}
            {tab === 'account' && <AccountTab toast={setToastMsg} />}
          </div>
        </main>
      </div>

      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
    </div>
  );
}
