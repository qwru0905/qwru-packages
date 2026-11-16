import type { DiscordChannelId, YoutubeProfile } from "@qwru/types";

export async function getYoutubeProfilesByDiscordChannelId(
  db: D1Database,
  id: DiscordChannelId
) {
  const { results } = await db.prepare(
    `SELECT p.code, p.name, p.ext_id
    FROM channel_link l
    JOIN youtube_profiles p ON p.code = l.youtube_code
    WHERE l.discord_channel_id = ?`
  )
    .bind(id)
    .all<YoutubeProfile>();
  return results;
}

export async function getDiscordChannelIdsByYoutubeProfileCode(
  db: D1Database,
  code: string
) {
  const { results } = await db.prepare(`SELECT discord_channel_id FROM idx_channel_link_youtube WHERE youtube_code = ?`)
    .bind(code)
    .all<DiscordChannelId>();
  return results;
}

export async function addChannelLink(
  db: D1Database,
  discord_channel_id: DiscordChannelId,
  youtube_code: string
) {
  const result = await db.prepare("INSERT OR IGNORE INTO channel_link (discord_channel_id, youtube_code) VALUES (?, ?)")
    .bind(discord_channel_id, youtube_code)
    .run();

  return result.meta.changes > 0;
}
