CREATE TABLE channel_link (
  discord_channel_id TEXT NOT NULL,
  youtube_code       TEXT NOT NULL REFERENCES youtube_profiles(code) ON DELETE CASCADE,
  PRIMARY KEY (discord_channel_id, youtube_code)
);
CREATE INDEX idx_channel_link_youtube ON channel_link (youtube_code, discord_channel_id);
