import type { YoutubeProfile, YoutubeVideo } from "@qwru/types";

interface VideoRow {
  id: number;
  ext_id: string;
  title: string;
  description: string | null;
  is_public: number;
  p_code: string;
  p_ext_id: string;
  p_name: string;
}

export async function getVideoByExtID(
  db: D1Database,
  ext_id: string,
): Promise<YoutubeVideo | null> {
  const row = await db
    .prepare(
      `SELECT v.id, v.ext_id, v.title, v.description, v.is_public,
			        p.code AS p_code, p.ext_id AS p_ext_id, p.name AS p_name
			 FROM youtube_videos v
			 JOIN youtube_profiles p ON p.code = v.author
			 WHERE v.ext_id = ?`,
    )
    .bind(ext_id)
    .first<VideoRow>();

  if (!row) return null;

  const { p_code, p_ext_id, p_name, ...video } = row;
  return {
    ...video,
    profile: { code: p_code, ext_id: p_ext_id, name: p_name },
  };
}

export async function setPublicVideo(
  db: D1Database,
  id: number,
  is_public: boolean
) {
  return db.prepare(
    "UPDATE youtube_videos SET is_public = ? WHERE id = ? RETURNING *"
  )
    .bind(is_public ? 1 : 0, id)
    .first<YoutubeVideo>();
}

export async function createVideo(
  db: D1Database,
  ext_id: string,
  author: string,
  title: string,
  opts: { description?: string; is_public?: boolean } = {}
) {
  return db.prepare("INSERT INTO youtube_videos (ext_id, author, title, description, is_public) VALUES (?, ?, ?, ?, ?) RETURNING *")
    .bind(ext_id, author, title, opts.description ?? null, opts.is_public ? 1 : 0)
    .first<YoutubeVideo>();
}

export async function getProfileByExtID(
  db: D1Database,
  ext_id: string
) {
  return db.prepare("SELECT * FROM youtube_profiles WHERE ext_id = ?")
    .bind(ext_id)
    .first<YoutubeProfile>();
}

export async function createProfile(
  db: D1Database,
  code: string,
  ext_id: string,
  name: String
) {
  return db.prepare("INSERT INTO youtube_profiles (code, ext_id, name) VALUE (?, ?, ?) RETURNING *")
    .bind(code, ext_id, name)
    .first<YoutubeProfile>();
}
