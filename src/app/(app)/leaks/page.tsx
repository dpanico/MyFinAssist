import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function LeaksPage() {
  return (
    <PlaceholderPage
      title="Lifestyle Leaks"
      purpose="Flags factual, non-judgmental spending patterns that are rising quietly."
      laterPhase="Leak detection is planned for Phase 5."
      bullets={[
        "Category and merchant comparison windows",
        "Large transaction and small-purchase pileup alerts",
        "Uncategorized transaction warnings"
      ]}
    />
  );
}
