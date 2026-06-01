import { SettingsNav } from "@/components/app-shell/settings-nav";
import { SettingsAccountsClient } from "@/features/accounts/settings-accounts-client";

export default function SettingsAccountsPage() {
  return (
    <>
      <SettingsNav />
      <SettingsAccountsClient />
    </>
  );
}
