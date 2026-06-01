import { Card, SectionHeader } from "@/components/ui/card";

export default function MriPage() {
  return (
    <div>
      <SectionHeader
        title="Financial MRI"
        description="A Phase 1 placeholder for the monthly snapshot of net worth, assets, liabilities, liquidity, and account status."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          "Net worth",
          "Total assets",
          "Total liabilities",
          "Liquid vs restricted"
        ].map((label) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">
              Phase 2+
            </p>
          </Card>
        ))}
      </div>
      <Card className="mt-5">
        <p className="text-sm leading-6 text-slate-600">
          The foundation now tracks accounts, status, tracking method, data
          quality, and manual balances. Full MRI calculations will be built
          after manual data and CSV workflows are in place.
        </p>
      </Card>
    </div>
  );
}
