import { flagCodeToYtLocale } from "@/config/languages";

/**
 * Parses YouTube or Vimeo URLs and returns the corresponding embed URL.
 * Supports adding subtitle translation, autoplay, and branding parameters for YouTube.
 * Also preserves playlist context (list and index) for YouTube embeds.
 *
 * Supports:
 * - YouTube watch URLs (youtube.com/watch?v=...)
 * - YouTube short URLs (youtu.be/...)
 * - YouTube embed URLs (youtube.com/embed/...)
 * - Vimeo video URLs (vimeo.com/...)
 * - Vimeo player URLs (player.vimeo.com/video/...)
 */
export function getVideoEmbedUrl(url: string, langCode?: string): string {
  if (!url) return "";

  let embedUrl = "";
  let isYouTube = false;

  // Extract list parameter if present in the original URL
  const listMatch = url.match(/[?&]list=([^&\s]+)/);
  const playlistId = listMatch ? listMatch[1] : "";

  // YouTube long URLs (e.g., watch?v=ID, embed/ID, v/ID)
  const ytLongMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\s?]+)/);
  if (ytLongMatch && ytLongMatch[1]) {
    const videoId = ytLongMatch[1];
    if (playlistId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?list=${playlistId}`;
    } else {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    isYouTube = true;
  }

  // YouTube short URLs (e.g., youtu.be/ID)
  const ytShortMatch = url.match(/youtu\.be\/([^&\s?]+)/);
  if (!embedUrl && ytShortMatch && ytShortMatch[1]) {
    const videoId = ytShortMatch[1];
    if (playlistId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?list=${playlistId}`;
    } else {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    isYouTube = true;
  }

  // Fallback for raw playlist URLs without video ID
  if (!embedUrl && playlistId) {
    embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
    isYouTube = true;
  }

  // Vimeo URLs (e.g., vimeo.com/ID or player.vimeo.com/video/ID)
  if (!embedUrl) {
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      const hashMatch = url.match(/[?&]h=([^&\s]+)/);
      const hashParam = hashMatch ? `?h=${hashMatch[1]}` : "";
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}${hashParam}`;
    }
  }

  // Fallback to original URL if no pattern matched
  if (!embedUrl) {
    embedUrl = url;
  }

  // Add configuration and translation/subtitle parameters for YouTube
  if (isYouTube) {
    const separator = embedUrl.includes("?") ? "&" : "?";
    // autoplay=1, modestbranding=1, rel=0, iv_load_policy=3 (disable annotations)
    embedUrl = `${embedUrl}${separator}autoplay=1&modestbranding=1&rel=0&iv_load_policy=3`;

    if (langCode) {
      const targetLang = flagCodeToYtLocale[langCode] || langCode;
      embedUrl = `${embedUrl}&cc_load_policy=1&cc_lang_pref=${targetLang}&hl=${targetLang}`;
    }
  }

  return embedUrl;
}
