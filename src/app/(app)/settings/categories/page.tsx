import { SettingsNav } from "@/components/app-shell/settings-nav";
import { StatusBadge } from "@/components/badges/status-badge";
import { Card, SectionHeader } from "@/components/ui/card";
import { defaultCategorySeed } from "@/lib/finance/options";

export default function SettingsCategoriesPage() {
  return (
    <>
      <SettingsNav />
      <SectionHeader
        title="Categories"
        description="Default Phase 1 categories keep transaction type separate from category."
      />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Default transaction type</th>
                <th className="py-2 pr-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {defaultCategorySeed.map((category) => (
                <tr key={category.label} className="border-b border-slate-100">
                  <td className="py-3 pr-3 font-medium">{category.label}</td>
                  <td className="py-3 pr-3">
                    <StatusBadge value={category.value} />
                  </td>
                  <td className="py-3 pr-3 text-slate-600">Seed category</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
