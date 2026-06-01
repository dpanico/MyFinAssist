import { SettingsNav } from "@/components/app-shell/settings-nav";
import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default function SettingsRulesPage() {
  return (
    <>
      <SettingsNav />
      <PlaceholderPage
        title="Transaction Rules"
        purpose="Stores future categorization and classification rules without applying automatic changes in Phase 1."
        laterPhase="Rule previews are planned for Phase 2."
        bullets={[
          "Match text and merchant patterns",
          "Suggested transaction type and category",
          "Manual review before broad automation"
        ]}
      />
    </>
  );
}
