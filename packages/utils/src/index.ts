import type { YoutubeVideo } from "@qwru/types";

export const isPublic = (video: Pick<YoutubeVideo, "is_public">): boolean =>
  video.is_public === 1;
