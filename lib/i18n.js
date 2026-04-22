export const pick = (obj, field, lang) => {
  if (!obj) return '';
  if (lang === 'en') return obj[field + '_en'] || obj[field] || '';
  return obj[field] || obj[field + '_en'] || '';
};

export const strings = {
  back: { ar: 'رجوع', en: 'Back' },
  noLinks: { ar: 'لا توجد روابط هنا بعد.', en: 'No links here yet.' }
};

export const tr = (key, lang) => {
  const v = strings[key];
  if (!v) return '';
  return v[lang] || v.ar || '';
};

export const readLangFromCookie = async (cookies) => {
  const store = await cookies();
  const v = store.get('lang')?.value;
  return v === 'en' ? 'en' : 'ar';
};
