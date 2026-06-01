import { SettingsNav } from "@/components/app-shell/settings-nav";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function SettingsImportsPage() {
  return (
    <>
      <SettingsNav />
      <PlaceholderPage
        title="Imports"
        purpose="Defines the future generic CSV/manual import workflow without depending on any one bank or spreadsheet."
        laterPhase="CSV mapping and import review are planned for Phase 2."
        bullets={[
          "Generic date, description, amount, debit, credit, and account mapping",
          "Import job status tracking",
          "Review before writing final transactions"
        ]}
      />
    </>
  );
}
