import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED = {
  image: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/quicktime']
};

const MAX_SIZE = {
  image: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024
};

async function requireAuth() {
  const store = await cookies();
  const token = store.get('auth_token');
  return token && token.value === 'authenticated';
}

export async function POST(request) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

    const formData = await request.formData();
    const file = formData.get('file');
    const kind = formData.get('kind') || 'image';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'لم يتم إرفاق ملف' }, { status: 400 });
    }

    const allowed = ALLOWED[kind];
    const maxSize = MAX_SIZE[kind];
    if (!allowed || !allowed.includes(file.type)) {
      return NextResponse.json({ error: 'نوع الملف غير مسموح' }, { status: 400 });
    }
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'حجم الملف كبير جداً' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (file.type === 'video/mp4' ? '.mp4' : '');
    const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 32) || kind;
    const filename = `${Date.now()}_${safeBase}${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}`, name: file.name, size: file.size });
  } catch (e) {
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
