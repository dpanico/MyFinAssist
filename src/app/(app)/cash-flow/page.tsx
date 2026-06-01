import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function CashFlowPage() {
  return (
    <PlaceholderPage
      title="Cash Flow"
      purpose="Separates income, true expenses, debt payments, transfers, and internal payments."
      laterPhase="Cash-flow dashboards are planned for Phase 3."
      bullets={[
        "Transaction type stays separate from category",
        "Credit-card payments are not double-counted",
        "Free cash flow remains income minus true expenses and debt payments"
      ]}
    />
  );
}
