import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' };
export const UPLOAD_DIR = path.resolve('uploads');

export async function saveFile(file, folder) {
  const name = `${folder}/${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${EXT[file.mimetype]}`;
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_BUCKET = 'marketplace', API_URL } = process.env;

  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { error } = await sb.storage.from(SUPABASE_BUCKET).upload(name, file.buffer, { contentType: file.mimetype });
    if (error) throw new Error(`Falha no upload: ${error.message}`);
    return sb.storage.from(SUPABASE_BUCKET).getPublicUrl(name).data.publicUrl;
  }
  const full = path.join(UPLOAD_DIR, name); // fallback local (desenvolvimento)
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, file.buffer);
  return `${API_URL || 'http://localhost:4000'}/uploads/${name}`;
}
