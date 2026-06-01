import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function TransfersPage() {
  return (
    <PlaceholderPage
      title="Transfers"
      purpose="Reviews possible internal money movement so spending and income are not overstated."
      laterPhase="Transfer matching is planned for Phase 4."
      bullets={[
        "Amount and date-window matching",
        "Confidence scoring",
        "Approve and reject review actions"
      ]}
    />
  );
}
