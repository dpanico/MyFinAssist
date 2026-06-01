"use client";

import { FormEvent, useMemo, useState } from "react";
import { FilePlus, Save } from "lucide-react";
import { SettingsNav } from "@/components/app-shell/settings-nav";
import { StatusBadge } from "@/components/badges/status-badge";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-states/empty-state";
import { useFinanceWorkspace } from "@/features/workspace/use-finance-workspace";
import { documentTypeOptions, reviewStatusOptions } from "@/lib/finance/options";
import type { DocumentType, ReviewStatus } from "@/lib/finance/types";
import { statementSchema } from "@/lib/validation/schemas";
import { formatCurrency } from "@/lib/utils/format";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function SettingsStatementsClient() {
  const {
    workspace,
    addMockStatement,
    updateExtractionStatus
  } = useFinanceWorkspace();
  const [message, setMessage] = useState("");

  const documentRows = useMemo(() => {
    return workspace.uploadedDocuments.map((document) => ({
      document,
      account: workspace.accounts.find((account) => account.id === document.accountId),
      items: workspace.extractedStatementItems.filter(
        (item) => item.documentId === document.id
      )
    }));
  }, [workspace.accounts, workspace.extractedStatementItems, workspace.uploadedDocuments]);

  function submitStatement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = statementSchema.safeParse({
      accountId: field(formData, "accountId"),
      documentType: field(formData, "documentType"),
      periodStart: field(formData, "periodStart"),
      periodEnd: field(formData, "periodEnd"),
      fileName: field(formData, "fileName")
    });

    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Statement is invalid.");
      return;
    }

    addMockStatement({
      accountId: result.data.accountId,
      documentType: result.data.documentType as DocumentType,
      periodStart: result.data.periodStart,
      periodEnd: result.data.periodEnd,
      fileName: result.data.fileName
    });
    setMessage("Mock statement record and staged extraction created.");
    form.reset();
  }

  return (
    <>
      <SettingsNav />
      <SectionHeader
        title="Statements"
        description="Create placeholder statement records and review mock extracted fields before any final financial table receives data."
      />

      {message ? (
        <p className="mb-4 rounded-md bg-slate-100 p-3 text-sm text-slate-700">
          {message}
        </p>
      ) : null}

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">
          Create mock statement record
        </h2>
        <form onSubmit={submitStatement} className="mt-4 grid gap-4 lg:grid-cols-5">
          <label className="text-sm font-medium text-slate-700 lg:col-span-2">
            Account
            <select
              name="accountId"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950"
            >
              {workspace.accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Document type
            <select
              name="documentType"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950"
            >
              {documentTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Period start
            <input
              type="date"
              name="periodStart"
              defaultValue="2026-05-01"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Period end
            <input
              type="date"
              name="periodEnd"
              defaultValue="2026-05-31"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 lg:col-span-5">
            File name or placeholder reference
            <input
              name="fileName"
              defaultValue="sample-statement.pdf"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white lg:col-span-5"
          >
            <FilePlus size={16} aria-hidden="true" />
            Create mock statement
          </button>
        </form>
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Statement review queue
        </h2>
        {documentRows.length === 0 ? (
          <EmptyState title="No statement records">
            Create a placeholder statement record to stage mock extracted fields.
          </EmptyState>
        ) : (
          <div className="mt-4 space-y-5">
            {documentRows.map(({ document, account, items }) => (
              <section
                key={document.id}
                className="rounded-md border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {document.fileName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {account?.name ?? "Unknown account"} | {document.periodStart} to{" "}
                      {document.periodEnd}
                    </p>
                  </div>
                  <StatusBadge value={document.reviewStatus} />
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-sm">
                    <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="py-2 pr-3">Field</th>
                        <th className="py-2 pr-3">Extracted value</th>
                        <th className="py-2 pr-3">Normalized</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-3 pr-3 font-medium">{item.label}</td>
                          <td className="py-3 pr-3">{item.extractedValue}</td>
                          <td className="py-3 pr-3">
                            {item.normalizedValue === null
                              ? "N/A"
                              : formatCurrency(item.normalizedValue)}
                          </td>
                          <td className="py-3 pr-3">
                            <StatusBadge value={item.reviewStatus} />
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex gap-2">
                              {reviewStatusOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() =>
                                    updateExtractionStatus(
                                      item.id,
                                      option.value as ReviewStatus
                                    )
                                  }
                                  className="inline-flex min-h-8 items-center gap-1 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700"
                                  title={`Mark ${option.label}`}
                                >
                                  <Save size={12} aria-hidden="true" />
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
