// ── Insignia Database ─────────────────────────────────────────────────────────
// Each plan earns one insignia upon completion.
// XP formula: Math.max(50, total_pages * 5)  — matches use-xp.ts xpForPlan()

export type InsigniaTier = "bronze" | "silver" | "gold";

export interface Insignia {
  /** Matches Plan.plan */
  planId: string;
  order: number;
  /** Single emoji that visually represents the badge */
  icon: string;
  /** Short badge name (without emoji) */
  badge: string;
  /** XP awarded on completion */
  xp: number;
  tier: InsigniaTier;
  /** One-liner shown on the reward toast / profile card */
  rewardTitle: string;
  /** Flavour text describing the accomplishment */
  rewardDescription: string;
}

export const INSIGNIA: Insignia[] = [
  {
    planId: "Introduction",
    order: 1,
    icon: "🔑",
    badge: "Seeker of Truth",
    xp: 50,
    tier: "bronze",
    rewardTitle: "First Steps",
    rewardDescription: "You opened the door to one of history's greatest narratives.",
  },
  {
    planId: "Decline",
    order: 2,
    icon: "🏛️",
    badge: "Witness of the Fall",
    xp: 155,
    tier: "silver",
    rewardTitle: "Darkness Witnessed",
    rewardDescription: "You traced how spiritual light can fade across centuries.",
  },
  {
    planId: "Forerunners",
    order: 3,
    icon: "🔥",
    badge: "Torchbearer",
    xp: 210,
    tier: "silver",
    rewardTitle: "Voices Heard",
    rewardDescription: "You walked beside the brave souls who refused to be silenced.",
  },
  {
    planId: "Reformation",
    order: 4,
    icon: "⚔️",
    badge: "Reformer's Heart",
    xp: 325,
    tier: "gold",
    rewardTitle: "Empire Shaken",
    rewardDescription: "You stood with the reformers who challenged the mightiest power of their age.",
  },
  {
    planId: "Europe",
    order: 5,
    icon: "🌍",
    badge: "Flame Spreader",
    xp: 280,
    tier: "gold",
    rewardTitle: "Truth Spreads",
    rewardDescription: "You watched the fire of reform cross borders and ignite a continent.",
  },
  {
    planId: "America",
    order: 6,
    icon: "🗽",
    badge: "New World Pioneer",
    xp: 200,
    tier: "silver",
    rewardTitle: "New Beginning",
    rewardDescription: "You discovered how a new land became a last refuge for religious liberty.",
  },
  {
    planId: "Prophecy",
    order: 7,
    icon: "⏳",
    badge: "Time Watcher",
    xp: 240,
    tier: "silver",
    rewardTitle: "Prophecy Decoded",
    rewardDescription: "You unlocked the prophetic timeline that shapes our very present moment.",
  },
  {
    planId: "Sanctuary",
    order: 8,
    icon: "🕊️",
    badge: "Veil Walker",
    xp: 150,
    tier: "silver",
    rewardTitle: "Veil Lifted",
    rewardDescription: "You journeyed through the heavenly sanctuary and found its meaning for today.",
  },
  {
    planId: "Revival",
    order: 9,
    icon: "📖",
    badge: "Mirror Seeker",
    xp: 145,
    tier: "bronze",
    rewardTitle: "Mirror Held Up",
    rewardDescription: "You examined the tests that separate genuine revival from mere emotion.",
  },
  {
    planId: "Origin-of-Evil",
    order: 10,
    icon: "🐍",
    badge: "Truth Unveiler",
    xp: 210,
    tier: "silver",
    rewardTitle: "Origin Understood",
    rewardDescription: "You traced the very root of evil — and the answer hidden in Christ.",
  },
  {
    planId: "Spiritualism",
    order: 11,
    icon: "👻",
    badge: "Discerning Mind",
    xp: 50,
    tier: "bronze",
    rewardTitle: "Deception Spotted",
    rewardDescription: "You armed yourself against one of the last great deceptions of earth.",
  },
  {
    planId: "Liberty",
    order: 12,
    icon: "🗝️",
    badge: "Freedom Defender",
    xp: 70,
    tier: "bronze",
    rewardTitle: "Liberty Guarded",
    rewardDescription: "You understood why conscience can never bow to earthly power.",
  },
  {
    planId: "Final-Conflict",
    order: 13,
    icon: "🛡️",
    badge: "Overcomer",
    xp: 345,
    tier: "gold",
    rewardTitle: "Victory Secured",
    rewardDescription: "You faced the final conflict — and saw how the story ends in triumph.",
  },
  {
    planId: "Appendix",
    order: 14,
    icon: "📜",
    badge: "Master Scholar",
    xp: 100,
    tier: "bronze",
    rewardTitle: "Full Picture",
    rewardDescription: "You completed every page — a journey few readers ever finish.",
  },
];

/** Quick lookup by planId */
export const INSIGNIA_BY_PLAN: Record<string, Insignia> = Object.fromEntries(
  INSIGNIA.map((i) => [i.planId, i])
);

/** Tier display config */
export const TIER_CONFIG: Record<InsigniaTier, { label: string; color: string; ring: string; border: string }> = {
  bronze: { label: "Bronze", color: "text-amber-700",  ring: "ring-amber-500/40",  border: "border-amber-500/50"  },
  silver: { label: "Silver", color: "text-slate-400",  ring: "ring-slate-400/40",  border: "border-slate-400/50"  },
  gold:   { label: "Gold",   color: "text-yellow-400", ring: "ring-yellow-400/40", border: "border-yellow-400/60" },
};
