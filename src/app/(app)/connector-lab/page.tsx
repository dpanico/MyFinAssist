import { StatusBadge } from "@/components/badges/status-badge";
import { Card, SectionHeader } from "@/components/ui/card";
import { getMockConnectorReport } from "@/features/connector-lab/mock-provider";

export default function ConnectorLabPage() {
  const report = getMockConnectorReport();

  return (
    <div>
      <SectionHeader
        title="Connector Lab"
        description="Mock provider feasibility report for testing account coverage without real credentials or provider calls."
      />
      <Card>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              {report.providerName}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {report.summary} Real Plaid, SimpleFIN, Teller, SnapTrade, and
              direct APIs are intentionally excluded from Phase 1.
            </p>
          </div>
          <StatusBadge value="manual" label="Mock only" />
        </div>
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Mock capability report
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-3">Provider</th>
                <th className="py-2 pr-3">Institution</th>
                <th className="py-2 pr-3">Account</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Balance</th>
                <th className="py-2 pr-3">Transactions</th>
                <th className="py-2 pr-3">Holdings</th>
                <th className="py-2 pr-3">Recommended</th>
                <th className="py-2 pr-3">Quality</th>
              </tr>
            </thead>
            <tbody>
              {report.accounts.map((account) => (
                <tr key={account.id} className="border-b border-slate-100 align-top">
                  <td className="py-3 pr-3 font-medium">{account.providerName}</td>
                  <td className="py-3 pr-3">{account.institutionName}</td>
                  <td className="py-3 pr-3">{account.accountName}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={account.accountType} />
                  </td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={account.connectionStatus} />
                  </td>
                  <td className="py-3 pr-3">
                    {account.hasCurrentBalance ? "Available" : "Unavailable"}
                  </td>
                  <td className="py-3 pr-3">
                    {account.hasTransactions
                      ? `${account.transactionHistoryMonths} months`
                      : "Unavailable"}
                  </td>
                  <td className="py-3 pr-3">
                    {account.hasHoldings ? "Available" : "Unavailable"}
                  </td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={account.recommendedTrackingMethod} />
                  </td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={account.dataQualityStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
