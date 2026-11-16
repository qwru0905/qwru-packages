export interface YoutubeProfile {
  code: string;
  ext_id: string;
  name: string;
}

export interface YoutubeVideo {
  id: number;
  ext_id: string;
  title: string;
  description: string | null;
  is_public: number; // 0 | 1
  profile: YoutubeProfile;
}

export type DiscordChannelId = string & { __brand: "DiscordChannelId" };

export type YoutubeHookMessageBody = {
  action: "youtube_hook";
  ext_id: string;
};

export type DiscordMessageBody = YoutubeHookMessageBody;
