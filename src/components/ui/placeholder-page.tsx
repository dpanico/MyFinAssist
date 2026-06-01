import { Card, SectionHeader } from "@/components/ui/card";

export function PlaceholderPage({
  title,
  purpose,
  laterPhase,
  bullets
}: {
  title: string;
  purpose: string;
  laterPhase: string;
  bullets: string[];
}) {
  return (
    <div>
      <SectionHeader title={title} description={purpose} />
      <Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-slate-500">
              Planned for later
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              {laterPhase}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Phase 1 establishes the route, navigation, data contracts, and
              placeholder surface only. No fake final analytics are shown here.
            </p>
          </div>
          <ul className="grid gap-3 text-sm text-slate-700">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
