// shadcn/ui components conventionally import `cn` from "@/lib/utils". This
// project already has the same helper at "@/utils/tailwind-merge" (used by
// components.json's `lib` alias) — re-exporting it here keeps a single
// implementation while letting drop-in shadcn snippets resolve unmodified.
export { cn } from "@/utils/tailwind-merge";
