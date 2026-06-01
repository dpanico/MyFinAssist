import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function InvestmentsPage() {
  return (
    <PlaceholderPage
      title="Investment Performance"
      purpose="Separates contributions and withdrawals from estimated investment growth."
      laterPhase="Estimated performance dashboards are planned for Phase 3."
      bullets={[
        "Monthly beginning and ending balances",
        "Contributions and withdrawals",
        "Estimated growth and estimated return guardrails"
      ]}
    />
  );
}
