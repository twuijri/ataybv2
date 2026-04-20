import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime'
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request, ctx) {
  const params = await ctx.params;
  const segments = params?.path || [];
  const filename = segments.join('/');

  const resolved = path.resolve(UPLOADS_DIR, filename);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep) && resolved !== UPLOADS_DIR) {
    return new Response('Forbidden', { status: 403 });
  }
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
    return new Response('Not found', { status: 404 });
  }

  const ext = path.extname(resolved).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const stat = fs.statSync(resolved);

  const range = request.headers.get('range');
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? parseInt(m[2], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(resolved, { start, end });
      return new Response(stream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': type,
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    }
  }

  const stream = fs.createReadStream(resolved);
  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': type,
      'Content-Length': String(stat.size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
