/** Dispatched on `window` every time the user clicks a video play button. */
export const VIDEO_PLAY_EVENT = "video-play";

/** Increment the persistent video-play counter and fire the custom event. */
export function dispatchVideoPlay(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(VIDEO_PLAY_EVENT));
}
