import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function MonthlyReportPage() {
  return (
    <PlaceholderPage
      title="Monthly Report"
      purpose="Creates a rule-based plain-English monthly financial close summary."
      laterPhase="The Monthly CFO Report engine is planned for Phase 5."
      bullets={[
        "Executive summary",
        "Net worth, investment, and cash-flow summaries",
        "Review queues and action items"
      ]}
    />
  );
}
