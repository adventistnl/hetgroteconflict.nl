// ── Reading Plans Database ───────────────────────────────
// Derived from The Great Controversy by Ellen G. White

export interface PlanStep {
  step: number;
  action: "watch" | "read";
  label: string;
  duration_minutes: number;
  pages?: number;
  videoUrl?: string;
  videoCover?: string;
}

export interface PlanDay {
  day: number;
  chapter_number: number | null;
  title: string;
  pages: number;
  total_minutes_estimate: number;
  steps: PlanStep[];
}

export interface PlanChapter {
  chapter_number: number | null;
  title: string;
  pages: number;
  videoUrl: string | null;
  videoCover: string | null;
  video_minutes_estimate: number;
  reading_minutes_estimate: number;
}

export interface ReadingSchedule {
  duration_days: number;
  label: string;
  pages_per_day: number;
  avg_chapters_per_day: number;
}

export interface Plan {
  plan: string;
  title: string;
  description: string;
  chapters: PlanChapter[];
  total_pages: number;
  total_chapters: number;
  reading_schedules: ReadingSchedule[];
  daily_breakdown_standard: PlanDay[];
  badge: string;
  completion_message: string;
  order: number;
  next_plan: string | null;
  next_plan_cta: string;
  total_time_minutes_estimate: number;
  card_subtitle: string;
}

export const plansDatabase: Plan[] = [
  {
    plan: "Introduction",
    title: "Why This Battle Matters to You",
    description: "Introductory texts presenting the purpose and foundation of the book.",
    chapters: [
      { chapter_number: null, title: "Preface", pages: 2, videoUrl: null, videoCover: null, video_minutes_estimate: 0, reading_minutes_estimate: 6 },
      { chapter_number: null, title: "Introduction", pages: 6, videoUrl: null, videoCover: null, video_minutes_estimate: 0, reading_minutes_estimate: 18 },
    ],
    total_pages: 8, total_chapters: 2,
    reading_schedules: [
      { duration_days: 2, label: "Standard (1 chapter/day)", pages_per_day: 4.0, avg_chapters_per_day: 1.0 },
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 2.7, avg_chapters_per_day: 0.67 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 1.1, avg_chapters_per_day: 0.29 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: null, title: "Preface", pages: 2, total_minutes_estimate: 6, steps: [{ step: 1, action: "read", label: "Read the chapter", duration_minutes: 6, pages: 2 }] },
      { day: 2, chapter_number: null, title: "Introduction", pages: 6, total_minutes_estimate: 18, steps: [{ step: 1, action: "read", label: "Read the chapter", duration_minutes: 18, pages: 6 }] },
    ],
    badge: "🔑 Seeker of Truth",
    completion_message: "You've taken the first step into the greatest story ever told.",
    order: 1, next_plan: "Decline",
    next_plan_cta: "Ready for what's next? Continue to \"When Light Fades: The Fall of a Holy City\"",
    total_time_minutes_estimate: 24,
    card_subtitle: "2 chapters · 8 pages · ~24 min total",
  },
  {
    plan: "Decline",
    title: "When Light Fades: The Fall of a Holy City",
    description: "The spiritual decline of Israel and the early Christian church, culminating in medieval apostasy.",
    chapters: [
      { chapter_number: 1, title: "The Destruction of Jerusalem", pages: 15, videoUrl: "https://www.youtube.com/watch?v=hqxivq-m3t0", videoCover: "https://i.ytimg.com/vi/hqxivq-m3t0/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 45 },
      { chapter_number: 2, title: "Persecution in the First Centuries", pages: 7, videoUrl: "https://www.youtube.com/watch?v=zyQfRm2ivGA", videoCover: "https://i.ytimg.com/vi/zyQfRm2ivGA/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 3, title: "An Era of Spiritual Darkness", pages: 9, videoUrl: "https://www.youtube.com/watch?v=aIQsFMbLj1Y", videoCover: "https://i.ytimg.com/vi/aIQsFMbLj1Y/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
    ],
    total_pages: 31, total_chapters: 3,
    reading_schedules: [
      { duration_days: 3, label: "Standard (1 chapter/day)", pages_per_day: 10.3, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 4.4, avg_chapters_per_day: 0.43 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 2.2, avg_chapters_per_day: 0.21 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 1.5, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 1, title: "The Destruction of Jerusalem", pages: 15, total_minutes_estimate: 52, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=hqxivq-m3t0", videoCover: "https://i.ytimg.com/vi/hqxivq-m3t0/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 45, pages: 15 }] },
      { day: 2, chapter_number: 2, title: "Persecution in the First Centuries", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=zyQfRm2ivGA", videoCover: "https://i.ytimg.com/vi/zyQfRm2ivGA/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 3, chapter_number: 3, title: "An Era of Spiritual Darkness", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=aIQsFMbLj1Y", videoCover: "https://i.ytimg.com/vi/aIQsFMbLj1Y/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
    ],
    badge: "🏛️ Witness of the Fall",
    completion_message: "You've witnessed how darkness can creep in unnoticed — stay alert for what comes next.",
    order: 2, next_plan: "Forerunners",
    next_plan_cta: "Ready for what's next? Continue to \"Voices in the Wilderness\"",
    total_time_minutes_estimate: 112, card_subtitle: "3 chapters · 31 pages · ~112 min total",
  },
  {
    plan: "Forerunners",
    title: "Voices in the Wilderness",
    description: "Movements and individuals who paved the way for the Protestant Reformation.",
    chapters: [
      { chapter_number: 4, title: "The Waldenses", pages: 12, videoUrl: "https://www.youtube.com/watch?v=9QOQqEq_mVE", videoCover: "https://i.ytimg.com/vi/9QOQqEq_mVE/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 36 },
      { chapter_number: 5, title: "John Wycliffe", pages: 13, videoUrl: "https://www.youtube.com/watch?v=ZHN8q6YrJfQ", videoCover: "https://i.ytimg.com/vi/ZHN8q6YrJfQ/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
      { chapter_number: 6, title: "Huss and Jerome", pages: 17, videoUrl: "https://www.youtube.com/watch?v=_tjvvEKjOKM", videoCover: "https://i.ytimg.com/vi/_tjvvEKjOKM/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 51 },
    ],
    total_pages: 42, total_chapters: 3,
    reading_schedules: [
      { duration_days: 3, label: "Standard (1 chapter/day)", pages_per_day: 14.0, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 6.0, avg_chapters_per_day: 0.43 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 3.0, avg_chapters_per_day: 0.21 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 2.0, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 4, title: "The Waldenses", pages: 12, total_minutes_estimate: 43, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=9QOQqEq_mVE", videoCover: "https://i.ytimg.com/vi/9QOQqEq_mVE/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 36, pages: 12 }] },
      { day: 2, chapter_number: 5, title: "John Wycliffe", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=ZHN8q6YrJfQ", videoCover: "https://i.ytimg.com/vi/ZHN8q6YrJfQ/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
      { day: 3, chapter_number: 6, title: "Huss and Jerome", pages: 17, total_minutes_estimate: 59, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=_tjvvEKjOKM", videoCover: "https://i.ytimg.com/vi/_tjvvEKjOKM/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 51, pages: 17 }] },
    ],
    badge: "🔥 Torchbearer",
    completion_message: "You've met the brave voices who refused to stay silent.",
    order: 3, next_plan: "Reformation",
    next_plan_cta: "Ready for what's next? Continue to \"One Man Against an Empire\"",
    total_time_minutes_estimate: 148, card_subtitle: "3 chapters · 42 pages · ~148 min total",
  },
  {
    plan: "Reformation",
    title: "One Man Against an Empire",
    description: "The core of the Reformation movement led by Luther and his contemporaries in Germany and Switzerland.",
    chapters: [
      { chapter_number: 7, title: "Luther's Separation From Rome", pages: 18, videoUrl: "https://www.youtube.com/watch?v=X_VzyUlatXk", videoCover: "https://i.ytimg.com/vi/X_VzyUlatXk/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 54 },
      { chapter_number: 8, title: "Luther Before the Diet", pages: 18, videoUrl: "https://www.youtube.com/watch?v=IXJd40mqyJ8", videoCover: "https://i.ytimg.com/vi/IXJd40mqyJ8/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 54 },
      { chapter_number: 9, title: "The Swiss Reformer", pages: 10, videoUrl: "https://www.youtube.com/watch?v=7MFBfC_2qo0", videoCover: "https://i.ytimg.com/vi/7MFBfC_2qo0/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 30 },
      { chapter_number: 10, title: "Progress of Reform in Germany", pages: 9, videoUrl: "https://www.youtube.com/watch?v=G0T-I4Q2oXI", videoCover: "https://i.ytimg.com/vi/G0T-I4Q2oXI/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
      { chapter_number: 11, title: "Protest of the Princes", pages: 10, videoUrl: "https://www.youtube.com/watch?v=4ZLe6ixlXfY", videoCover: "https://i.ytimg.com/vi/4ZLe6ixlXfY/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 30 },
    ],
    total_pages: 65, total_chapters: 5,
    reading_schedules: [
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 21.7, avg_chapters_per_day: 1.67 },
      { duration_days: 5, label: "Standard (1 chapter/day)", pages_per_day: 13.0, avg_chapters_per_day: 1.0 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 4.6, avg_chapters_per_day: 0.36 },
      { duration_days: 30, label: "30-Day Plan", pages_per_day: 2.2, avg_chapters_per_day: 0.17 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 7, title: "Luther's Separation From Rome", pages: 18, total_minutes_estimate: 62, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=X_VzyUlatXk", videoCover: "https://i.ytimg.com/vi/X_VzyUlatXk/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 54, pages: 18 }] },
      { day: 2, chapter_number: 8, title: "Luther Before the Diet", pages: 18, total_minutes_estimate: 62, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=IXJd40mqyJ8", videoCover: "https://i.ytimg.com/vi/IXJd40mqyJ8/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 54, pages: 18 }] },
      { day: 3, chapter_number: 9, title: "The Swiss Reformer", pages: 10, total_minutes_estimate: 36, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=7MFBfC_2qo0", videoCover: "https://i.ytimg.com/vi/7MFBfC_2qo0/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 30, pages: 10 }] },
      { day: 4, chapter_number: 10, title: "Progress of Reform in Germany", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=G0T-I4Q2oXI", videoCover: "https://i.ytimg.com/vi/G0T-I4Q2oXI/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
      { day: 5, chapter_number: 11, title: "Protest of the Princes", pages: 10, total_minutes_estimate: 36, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=4ZLe6ixlXfY", videoCover: "https://i.ytimg.com/vi/4ZLe6ixlXfY/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 30, pages: 10 }] },
    ],
    badge: "⚔️ Reformer's Heart",
    completion_message: "You've stood beside the reformers who shook an empire.",
    order: 4, next_plan: "Europe",
    next_plan_cta: "Ready for what's next? Continue to \"The Fire Spreads\"",
    total_time_minutes_estimate: 229, card_subtitle: "5 chapters · 65 pages · ~229 min total",
  },
  {
    plan: "Europe",
    title: "The Fire Spreads",
    description: "The expansion and challenges of the Reformation in other European nations.",
    chapters: [
      { chapter_number: 12, title: "The French Reformation", pages: 19, videoUrl: "https://www.youtube.com/watch?v=99_RAyAMnE4", videoCover: "https://i.ytimg.com/vi/99_RAyAMnE4/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 57 },
      { chapter_number: 13, title: "The Netherlands and Scandinavia", pages: 6, videoUrl: "https://www.youtube.com/watch?v=-jEronRgwko", videoCover: "https://i.ytimg.com/vi/-jEronRgwko/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 18 },
      { chapter_number: 14, title: "Later English Reformers", pages: 14, videoUrl: "https://www.youtube.com/watch?v=JzUT6bYARdY", videoCover: "https://i.ytimg.com/vi/JzUT6bYARdY/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 42 },
      { chapter_number: 15, title: "The Bible and the French Revolution", pages: 17, videoUrl: "https://www.youtube.com/watch?v=iwVEMCwQvIs", videoCover: "https://i.ytimg.com/vi/iwVEMCwQvIs/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 51 },
    ],
    total_pages: 56, total_chapters: 4,
    reading_schedules: [
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 18.7, avg_chapters_per_day: 1.33 },
      { duration_days: 4, label: "Standard (1 chapter/day)", pages_per_day: 14.0, avg_chapters_per_day: 1.0 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 4.0, avg_chapters_per_day: 0.29 },
      { duration_days: 30, label: "30-Day Plan", pages_per_day: 1.9, avg_chapters_per_day: 0.13 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 12, title: "The French Reformation", pages: 19, total_minutes_estimate: 65, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=99_RAyAMnE4", videoCover: "https://i.ytimg.com/vi/99_RAyAMnE4/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 57, pages: 19 }] },
      { day: 2, chapter_number: 13, title: "The Netherlands and Scandinavia", pages: 6, total_minutes_estimate: 24, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=-jEronRgwko", videoCover: "https://i.ytimg.com/vi/-jEronRgwko/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 18, pages: 6 }] },
      { day: 3, chapter_number: 14, title: "Later English Reformers", pages: 14, total_minutes_estimate: 49, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=JzUT6bYARdY", videoCover: "https://i.ytimg.com/vi/JzUT6bYARdY/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 42, pages: 14 }] },
      { day: 4, chapter_number: 15, title: "The Bible and the French Revolution", pages: 17, total_minutes_estimate: 59, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=iwVEMCwQvIs", videoCover: "https://i.ytimg.com/vi/iwVEMCwQvIs/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 51, pages: 17 }] },
    ],
    badge: "🌍 Flame Spreader",
    completion_message: "You've watched truth spread like wildfire across a continent.",
    order: 5, next_plan: "America",
    next_plan_cta: "Ready for what's next? Continue to \"A New World, A Final Hope\"",
    total_time_minutes_estimate: 197, card_subtitle: "4 chapters · 56 pages · ~197 min total",
  },
  {
    plan: "America",
    title: "A New World, A Final Hope",
    description: "Religious migration to the New World and the rise of new spiritual leaders.",
    chapters: [
      { chapter_number: 16, title: "The Pilgrim Fathers", pages: 8, videoUrl: "https://www.youtube.com/watch?v=F0SH80kbxBo", videoCover: "https://i.ytimg.com/vi/F0SH80kbxBo/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 24 },
      { chapter_number: 17, title: "Heralds of the Morning", pages: 13, videoUrl: "https://www.youtube.com/watch?v=TvP-t90helk", videoCover: "https://i.ytimg.com/vi/TvP-t90helk/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
      { chapter_number: 18, title: "An American Reformer", pages: 19, videoUrl: "https://www.youtube.com/watch?v=JTBzo2PdX-c", videoCover: "https://i.ytimg.com/vi/JTBzo2PdX-c/hqdefault.jpg", video_minutes_estimate: 8, reading_minutes_estimate: 57 },
    ],
    total_pages: 40, total_chapters: 3,
    reading_schedules: [
      { duration_days: 3, label: "Standard (1 chapter/day)", pages_per_day: 13.3, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 5.7, avg_chapters_per_day: 0.43 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 2.9, avg_chapters_per_day: 0.21 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 1.9, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 16, title: "The Pilgrim Fathers", pages: 8, total_minutes_estimate: 30, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=F0SH80kbxBo", videoCover: "https://i.ytimg.com/vi/F0SH80kbxBo/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 24, pages: 8 }] },
      { day: 2, chapter_number: 17, title: "Heralds of the Morning", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=TvP-t90helk", videoCover: "https://i.ytimg.com/vi/TvP-t90helk/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
      { day: 3, chapter_number: 18, title: "An American Reformer", pages: 19, total_minutes_estimate: 65, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 8, videoUrl: "https://www.youtube.com/watch?v=JTBzo2PdX-c", videoCover: "https://i.ytimg.com/vi/JTBzo2PdX-c/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 57, pages: 19 }] },
    ],
    badge: "🗽 New World Pioneer",
    completion_message: "You've crossed the ocean into a new chapter of hope.",
    order: 6, next_plan: "Prophecy",
    next_plan_cta: "Ready for what's next? Continue to \"The Clock Is Ticking\"",
    total_time_minutes_estimate: 141, card_subtitle: "3 chapters · 40 pages · ~141 min total",
  },
  {
    plan: "Prophecy",
    title: "The Clock Is Ticking",
    description: "The 19th-century Adventist movement, prophetic study, and the expectation of Christ's return.",
    chapters: [
      { chapter_number: 19, title: "Light Through Darkness", pages: 9, videoUrl: "https://www.youtube.com/watch?v=t7GjhC5J84c", videoCover: "https://i.ytimg.com/vi/t7GjhC5J84c/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
      { chapter_number: 20, title: "A Great Religious Awakening", pages: 14, videoUrl: "https://www.youtube.com/watch?v=40cTyLsM9No", videoCover: "https://i.ytimg.com/vi/40cTyLsM9No/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 42 },
      { chapter_number: 21, title: "A Warning Rejected", pages: 12, videoUrl: "https://www.youtube.com/watch?v=CiHUAoCiUzk", videoCover: "https://i.ytimg.com/vi/CiHUAoCiUzk/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 36 },
      { chapter_number: 22, title: "Prophecies Fulfilled", pages: 13, videoUrl: "https://www.youtube.com/watch?v=XMVAWpjgFqE", videoCover: "https://i.ytimg.com/vi/XMVAWpjgFqE/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
    ],
    total_pages: 48, total_chapters: 4,
    reading_schedules: [
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 16.0, avg_chapters_per_day: 1.33 },
      { duration_days: 4, label: "Standard (1 chapter/day)", pages_per_day: 12.0, avg_chapters_per_day: 1.0 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 3.4, avg_chapters_per_day: 0.29 },
      { duration_days: 30, label: "30-Day Plan", pages_per_day: 1.6, avg_chapters_per_day: 0.13 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 19, title: "Light Through Darkness", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=t7GjhC5J84c", videoCover: "https://i.ytimg.com/vi/t7GjhC5J84c/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
      { day: 2, chapter_number: 20, title: "A Great Religious Awakening", pages: 14, total_minutes_estimate: 49, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=40cTyLsM9No", videoCover: "https://i.ytimg.com/vi/40cTyLsM9No/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 42, pages: 14 }] },
      { day: 3, chapter_number: 21, title: "A Warning Rejected", pages: 12, total_minutes_estimate: 43, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=CiHUAoCiUzk", videoCover: "https://i.ytimg.com/vi/CiHUAoCiUzk/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 36, pages: 12 }] },
      { day: 4, chapter_number: 22, title: "Prophecies Fulfilled", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=XMVAWpjgFqE", videoCover: "https://i.ytimg.com/vi/XMVAWpjgFqE/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
    ],
    badge: "⏳ Time Watcher",
    completion_message: "You've counted down the days with those who watched the skies.",
    order: 7, next_plan: "Sanctuary",
    next_plan_cta: "Ready for what's next? Continue to \"Behind the Veil\"",
    total_time_minutes_estimate: 171, card_subtitle: "4 chapters · 48 pages · ~171 min total",
  },
  {
    plan: "Sanctuary",
    title: "Behind the Veil",
    description: "The doctrine of the heavenly sanctuary and Christ's ministry in judgment.",
    chapters: [
      { chapter_number: 23, title: "What is the Sanctuary?", pages: 10, videoUrl: "https://www.youtube.com/watch?v=phV6X-FxxKM", videoCover: "https://i.ytimg.com/vi/phV6X-FxxKM/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 30 },
      { chapter_number: 24, title: "In the Holy of Holies", pages: 7, videoUrl: "https://www.youtube.com/watch?v=_P_W89mgSEI", videoCover: "https://i.ytimg.com/vi/_P_W89mgSEI/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 25, title: "God's Law Immutable", pages: 13, videoUrl: "https://www.youtube.com/watch?v=sMBI1zpLiwY", videoCover: "https://i.ytimg.com/vi/sMBI1zpLiwY/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
    ],
    total_pages: 30, total_chapters: 3,
    reading_schedules: [
      { duration_days: 3, label: "Standard (1 chapter/day)", pages_per_day: 10.0, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 4.3, avg_chapters_per_day: 0.43 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 2.1, avg_chapters_per_day: 0.21 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 1.4, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 23, title: "What is the Sanctuary?", pages: 10, total_minutes_estimate: 36, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=phV6X-FxxKM", videoCover: "https://i.ytimg.com/vi/phV6X-FxxKM/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 30, pages: 10 }] },
      { day: 2, chapter_number: 24, title: "In the Holy of Holies", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=_P_W89mgSEI", videoCover: "https://i.ytimg.com/vi/_P_W89mgSEI/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 3, chapter_number: 25, title: "God's Law Immutable", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=sMBI1zpLiwY", videoCover: "https://i.ytimg.com/vi/sMBI1zpLiwY/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
    ],
    badge: "🕊️ Veil Walker",
    completion_message: "You've stepped behind the veil into the holiest truth of all.",
    order: 8, next_plan: "Revival",
    next_plan_cta: "Ready for what's next? Continue to \"The Mirror of the Soul\"",
    total_time_minutes_estimate: 109, card_subtitle: "3 chapters · 30 pages · ~109 min total",
  },
  {
    plan: "Revival",
    title: "The Mirror of the Soul",
    description: "A call to personal reform, spiritual revival, and preparation for judgment.",
    chapters: [
      { chapter_number: 26, title: "A Work of Reform", pages: 7, videoUrl: "https://www.youtube.com/watch?v=exwJzSvbjzg", videoCover: "https://i.ytimg.com/vi/exwJzSvbjzg/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 27, title: "Modern Revivals", pages: 13, videoUrl: "https://www.youtube.com/watch?v=x5O-TlyrADw", videoCover: "https://i.ytimg.com/vi/x5O-TlyrADw/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
      { chapter_number: 28, title: "Facing Life's Record", pages: 9, videoUrl: "https://www.youtube.com/watch?v=7VO4lTsIPQE", videoCover: "https://i.ytimg.com/vi/7VO4lTsIPQE/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
    ],
    total_pages: 29, total_chapters: 3,
    reading_schedules: [
      { duration_days: 3, label: "Standard (1 chapter/day)", pages_per_day: 9.7, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 4.1, avg_chapters_per_day: 0.43 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 2.1, avg_chapters_per_day: 0.21 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 1.4, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 26, title: "A Work of Reform", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=exwJzSvbjzg", videoCover: "https://i.ytimg.com/vi/exwJzSvbjzg/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 2, chapter_number: 27, title: "Modern Revivals", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=x5O-TlyrADw", videoCover: "https://i.ytimg.com/vi/x5O-TlyrADw/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
      { day: 3, chapter_number: 28, title: "Facing Life's Record", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=7VO4lTsIPQE", videoCover: "https://i.ytimg.com/vi/7VO4lTsIPQE/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
    ],
    badge: "📖 Mirror Seeker",
    completion_message: "You've looked into the mirror — now it's time to truly reform.",
    order: 9, next_plan: "Origin-of-Evil",
    next_plan_cta: "Ready for what's next? Continue to \"The Enemy Unmasked\"",
    total_time_minutes_estimate: 106, card_subtitle: "3 chapters · 29 pages · ~106 min total",
  },
  {
    plan: "Origin-of-Evil",
    title: "The Enemy Unmasked",
    description: "The origin of sin, the fall of Satan, and his actions against humanity.",
    chapters: [
      { chapter_number: 29, title: "The Origin of Evil", pages: 9, videoUrl: "https://www.youtube.com/watch?v=Pv7keO-RHo0", videoCover: "https://i.ytimg.com/vi/Pv7keO-RHo0/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
      { chapter_number: 30, title: "Enmity Between Man and Satan", pages: 5, videoUrl: "https://www.youtube.com/watch?v=w3ty4F87kKE", videoCover: "https://i.ytimg.com/vi/w3ty4F87kKE/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 15 },
      { chapter_number: 31, title: "Agency of Evil Spirits", pages: 5, videoUrl: "https://www.youtube.com/watch?v=SPGCQpQek8Y", videoCover: "https://i.ytimg.com/vi/SPGCQpQek8Y/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 15 },
      { chapter_number: 32, title: "Snares of Satan", pages: 9, videoUrl: "https://www.youtube.com/watch?v=jfm4NhH7rhc", videoCover: "https://i.ytimg.com/vi/jfm4NhH7rhc/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 27 },
      { chapter_number: 33, title: "The First Great Deception", pages: 14, videoUrl: "https://www.youtube.com/watch?v=C0YYLJNJs-A", videoCover: "https://i.ytimg.com/vi/C0YYLJNJs-A/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 42 },
    ],
    total_pages: 42, total_chapters: 5,
    reading_schedules: [
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 14.0, avg_chapters_per_day: 1.67 },
      { duration_days: 5, label: "Standard (1 chapter/day)", pages_per_day: 8.4, avg_chapters_per_day: 1.0 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 6.0, avg_chapters_per_day: 0.71 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 3.0, avg_chapters_per_day: 0.36 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 29, title: "The Origin of Evil", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=Pv7keO-RHo0", videoCover: "https://i.ytimg.com/vi/Pv7keO-RHo0/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
      { day: 2, chapter_number: 30, title: "Enmity Between Man and Satan", pages: 5, total_minutes_estimate: 21, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=w3ty4F87kKE", videoCover: "https://i.ytimg.com/vi/w3ty4F87kKE/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 15, pages: 5 }] },
      { day: 3, chapter_number: 31, title: "Agency of Evil Spirits", pages: 5, total_minutes_estimate: 21, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=SPGCQpQek8Y", videoCover: "https://i.ytimg.com/vi/SPGCQpQek8Y/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 15, pages: 5 }] },
      { day: 4, chapter_number: 32, title: "Snares of Satan", pages: 9, total_minutes_estimate: 33, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=jfm4NhH7rhc", videoCover: "https://i.ytimg.com/vi/jfm4NhH7rhc/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 27, pages: 9 }] },
      { day: 5, chapter_number: 33, title: "The First Great Deception", pages: 14, total_minutes_estimate: 49, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=C0YYLJNJs-A", videoCover: "https://i.ytimg.com/vi/C0YYLJNJs-A/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 42, pages: 14 }] },
    ],
    badge: "🐍 Truth Unveiler",
    completion_message: "You've unmasked the oldest deception in the universe.",
    order: 10, next_plan: "Spiritualism",
    next_plan_cta: "Ready for what's next? Continue to \"Whispers From the Grave\"",
    total_time_minutes_estimate: 157, card_subtitle: "5 chapters · 42 pages · ~157 min total",
  },
  {
    plan: "Spiritualism",
    title: "Whispers From the Grave",
    description: "Beliefs about death, the immortality of the soul, and communication with the dead.",
    chapters: [
      { chapter_number: 34, title: "Can Our Dead Speak to Us?", pages: 8, videoUrl: "https://www.youtube.com/watch?v=8BE4MwpJw6s", videoCover: "https://i.ytimg.com/vi/8BE4MwpJw6s/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 24 },
    ],
    total_pages: 8, total_chapters: 1,
    reading_schedules: [
      { duration_days: 1, label: "Standard (1 chapter/day)", pages_per_day: 8.0, avg_chapters_per_day: 1.0 },
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 2.7, avg_chapters_per_day: 0.33 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 1.1, avg_chapters_per_day: 0.14 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 34, title: "Can Our Dead Speak to Us?", pages: 8, total_minutes_estimate: 30, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=8BE4MwpJw6s", videoCover: "https://i.ytimg.com/vi/8BE4MwpJw6s/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 24, pages: 8 }] },
    ],
    badge: "👻 Discerning Mind",
    completion_message: "You've learned to tell truth from whispers in the dark.",
    order: 11, next_plan: "Liberty",
    next_plan_cta: "Ready for what's next? Continue to \"The Last Freedom\"",
    total_time_minutes_estimate: 30, card_subtitle: "1 chapter · 8 pages · ~30 min total",
  },
  {
    plan: "Liberty",
    title: "The Last Freedom",
    description: "Religious liberty, persecution over matters of conscience, and the union of church and state.",
    chapters: [
      { chapter_number: 35, title: "Liberty of Conscience Threatened", pages: 14, videoUrl: "https://www.youtube.com/watch?v=kZn7R7dFyeY", videoCover: "https://i.ytimg.com/vi/kZn7R7dFyeY/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 42 },
    ],
    total_pages: 14, total_chapters: 1,
    reading_schedules: [
      { duration_days: 1, label: "Standard (1 chapter/day)", pages_per_day: 14.0, avg_chapters_per_day: 1.0 },
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 4.7, avg_chapters_per_day: 0.33 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 2.0, avg_chapters_per_day: 0.14 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 1.0, avg_chapters_per_day: 0.07 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 35, title: "Liberty of Conscience Threatened", pages: 14, total_minutes_estimate: 49, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=kZn7R7dFyeY", videoCover: "https://i.ytimg.com/vi/kZn7R7dFyeY/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 42, pages: 14 }] },
    ],
    badge: "🗝️ Freedom Defender",
    completion_message: "You've discovered what's truly at stake when freedom is threatened.",
    order: 12, next_plan: "Final-Conflict",
    next_plan_cta: "Ready for what's next? Continue to \"The Final Countdown\"",
    total_time_minutes_estimate: 49, card_subtitle: "1 chapter · 14 pages · ~49 min total",
  },
  {
    plan: "Final-Conflict",
    title: "The Final Countdown",
    description: "The final eschatological events: worldwide conflict, the time of trouble, and the close of the great controversy.",
    chapters: [
      { chapter_number: 36, title: "The Impending Conflict", pages: 8, videoUrl: "https://www.youtube.com/watch?v=9QMHEWuRDf0", videoCover: "https://i.ytimg.com/vi/9QMHEWuRDf0/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 24 },
      { chapter_number: 37, title: "The Scriptures a Safeguard", pages: 7, videoUrl: "https://www.youtube.com/watch?v=fo5ayZR1O5c", videoCover: "https://i.ytimg.com/vi/fo5ayZR1O5c/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 38, title: "The Final Warning", pages: 7, videoUrl: "https://www.youtube.com/watch?v=yW8jluUYGdI", videoCover: "https://i.ytimg.com/vi/yW8jluUYGdI/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 39, title: "The Time of Trouble", pages: 15, videoUrl: "https://www.youtube.com/watch?v=78D2BC0pyKk", videoCover: "https://i.ytimg.com/vi/78D2BC0pyKk/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 45 },
      { chapter_number: 40, title: "God's People Delivered", pages: 13, videoUrl: "https://www.youtube.com/watch?v=ws9GnUQQJ08", videoCover: "https://i.ytimg.com/vi/ws9GnUQQJ08/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 39 },
      { chapter_number: 41, title: "Desolation of the Earth", pages: 7, videoUrl: "https://www.youtube.com/watch?v=qNVA6g5WjP8", videoCover: "https://i.ytimg.com/vi/qNVA6g5WjP8/hqdefault.jpg", video_minutes_estimate: 6, reading_minutes_estimate: 21 },
      { chapter_number: 42, title: "The Controversy Ended", pages: 12, videoUrl: "https://www.youtube.com/watch?v=zP1m_uEOAx0", videoCover: "https://i.ytimg.com/vi/zP1m_uEOAx0/hqdefault.jpg", video_minutes_estimate: 7, reading_minutes_estimate: 36 },
    ],
    total_pages: 69, total_chapters: 7,
    reading_schedules: [
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 23.0, avg_chapters_per_day: 2.33 },
      { duration_days: 7, label: "Standard (1 chapter/day)", pages_per_day: 9.9, avg_chapters_per_day: 1.0 },
      { duration_days: 21, label: "21-Day Plan", pages_per_day: 3.3, avg_chapters_per_day: 0.33 },
      { duration_days: 45, label: "45-Day Plan", pages_per_day: 1.5, avg_chapters_per_day: 0.16 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: 36, title: "The Impending Conflict", pages: 8, total_minutes_estimate: 30, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=9QMHEWuRDf0", videoCover: "https://i.ytimg.com/vi/9QMHEWuRDf0/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 24, pages: 8 }] },
      { day: 2, chapter_number: 37, title: "The Scriptures a Safeguard", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=fo5ayZR1O5c", videoCover: "https://i.ytimg.com/vi/fo5ayZR1O5c/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 3, chapter_number: 38, title: "The Final Warning", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=yW8jluUYGdI", videoCover: "https://i.ytimg.com/vi/yW8jluUYGdI/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 4, chapter_number: 39, title: "The Time of Trouble", pages: 15, total_minutes_estimate: 52, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=78D2BC0pyKk", videoCover: "https://i.ytimg.com/vi/78D2BC0pyKk/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 45, pages: 15 }] },
      { day: 5, chapter_number: 40, title: "God's People Delivered", pages: 13, total_minutes_estimate: 46, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=ws9GnUQQJ08", videoCover: "https://i.ytimg.com/vi/ws9GnUQQJ08/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 39, pages: 13 }] },
      { day: 6, chapter_number: 41, title: "Desolation of the Earth", pages: 7, total_minutes_estimate: 27, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 6, videoUrl: "https://www.youtube.com/watch?v=qNVA6g5WjP8", videoCover: "https://i.ytimg.com/vi/qNVA6g5WjP8/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 21, pages: 7 }] },
      { day: 7, chapter_number: 42, title: "The Controversy Ended", pages: 12, total_minutes_estimate: 43, steps: [{ step: 1, action: "watch", label: "Watch the chapter preview video", duration_minutes: 7, videoUrl: "https://www.youtube.com/watch?v=zP1m_uEOAx0", videoCover: "https://i.ytimg.com/vi/zP1m_uEOAx0/hqdefault.jpg" }, { step: 2, action: "read", label: "Read the chapter", duration_minutes: 36, pages: 12 }] },
    ],
    badge: "🛡️ Overcomer",
    completion_message: "You've reached the end of the story — and the beginning of eternity.",
    order: 13, next_plan: "Appendix",
    next_plan_cta: "Ready for what's next? Continue to \"Behind the Scenes\"",
    total_time_minutes_estimate: 252, card_subtitle: "7 chapters · 69 pages · ~252 min total",
  },
  {
    plan: "Appendix",
    title: "Behind the Scenes",
    description: "Notes, references, and supplementary revisions to the main text.",
    chapters: [
      { chapter_number: null, title: "Appendix", pages: 20, videoUrl: null, videoCover: null, video_minutes_estimate: 0, reading_minutes_estimate: 60 },
    ],
    total_pages: 20, total_chapters: 1,
    reading_schedules: [
      { duration_days: 1, label: "Standard (1 chapter/day)", pages_per_day: 20.0, avg_chapters_per_day: 1.0 },
      { duration_days: 3, label: "3-Day Plan", pages_per_day: 6.7, avg_chapters_per_day: 0.33 },
      { duration_days: 7, label: "7-Day Plan", pages_per_day: 2.9, avg_chapters_per_day: 0.14 },
      { duration_days: 14, label: "14-Day Plan", pages_per_day: 1.4, avg_chapters_per_day: 0.07 },
    ],
    daily_breakdown_standard: [
      { day: 1, chapter_number: null, title: "Appendix", pages: 20, total_minutes_estimate: 60, steps: [{ step: 1, action: "read", label: "Read the chapter", duration_minutes: 60, pages: 20 }] },
    ],
    badge: "📜 Master Scholar",
    completion_message: "You've gone deeper than most ever do. True scholarship.",
    order: 14, next_plan: null,
    next_plan_cta: "You've completed the entire journey through The Great Controversy! 🎉",
    total_time_minutes_estimate: 60, card_subtitle: "1 chapter · 20 pages · ~60 min total",
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return plansDatabase.find((p) => p.plan === planId);
}
