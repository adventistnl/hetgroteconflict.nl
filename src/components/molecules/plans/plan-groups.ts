// ── Reading Plan groups (UI grouping — not domain data) ──────────────────────
// Secular, catchy names targeting a non-religious audience.

export interface PlanGroup {
  id: string;
  label: string;
  subtitle: string;
  planIds: string[];
}

export const PLAN_GROUPS: PlanGroup[] = [
  {
    id: "quick",
    label: "Quick Watch",
    subtitle: "4 standalone stories · done before your coffee's cold",
    planIds: ["Introduction", "Spiritualism", "Liberty", "Appendix"],
  },
  {
    id: "weekend",
    label: "The Weekend Binge",
    subtitle: "5 three-part arcs · made for a slow Saturday",
    planIds: ["Decline", "Forerunners", "Sanctuary", "Revival", "America"],
  },
  {
    id: "deep",
    label: "Limited Series",
    subtitle: "3 multi-episode arcs · one chapter a day, deeper every time",
    planIds: ["Europe", "Prophecy", "Origin-of-Evil"],
  },
  {
    id: "epic",
    label: "The Main Event",
    subtitle: "2 complete sagas · the full story, start to finish",
    planIds: ["Reformation", "Final-Conflict"],
  },
];
