"use client";

import { FormEvent, useMemo, useState } from "react";
import { Pencil, Plus, RefreshCw, Save } from "lucide-react";
import { StatusBadge } from "@/components/badges/status-badge";
import { Card, SectionHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-states/empty-state";
import { useFinanceWorkspace } from "@/features/workspace/use-finance-workspace";
import {
  accountGroupOptions,
  accountStatusOptions,
  accountTypeOptions,
  dataQualityStatusOptions,
  liquidityClassOptions,
  riskClassOptions,
  syncStatusOptions,
  trackingMethodOptions
} from "@/lib/finance/options";
import type {
  AccountGroup,
  AccountStatus,
  AccountType,
  DataQualityStatus,
  LiquidityClass,
  RiskClass,
  SyncStatus,
  TrackingMethod
} from "@/lib/finance/types";
import { accountSchema, balanceSchema, institutionSchema } from "@/lib/validation/schemas";
import { formatCurrency } from "@/lib/utils/format";

function field(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function Select<T extends string>({
  name,
  options,
  defaultValue
}: {
  name: string;
  options: { value: T; label: string }[];
  defaultValue?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? options[0]?.value}
      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function SettingsAccountsClient() {
  const {
    workspace,
    latestBalances,
    saveInstitution,
    saveAccount,
    addBalance,
    resetDemoData
  } = useFinanceWorkspace();
  const [editingInstitutionId, setEditingInstitutionId] = useState<string | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const editingInstitution = workspace.institutions.find(
    (institution) => institution.id === editingInstitutionId
  );
  const editingAccount = workspace.accounts.find((account) => account.id === editingAccountId);

  const accountRows = useMemo(() => {
    return latestBalances.map(({ account, latestBalance }) => ({
      account,
      latestBalance,
      institution: workspace.institutions.find(
        (institution) => institution.id === account.institutionId
      )
    }));
  }, [latestBalances, workspace.institutions]);

  const recentBalances = useMemo(() => {
    return [...workspace.balances]
      .sort((a, b) => b.balanceDate.localeCompare(a.balanceDate))
      .slice(0, 8)
      .map((balance) => ({
        balance,
        account: workspace.accounts.find((account) => account.id === balance.accountId)
      }));
  }, [workspace.accounts, workspace.balances]);

  function submitInstitution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = institutionSchema.safeParse({
      name: field(formData, "name"),
      websiteUrl: field(formData, "websiteUrl"),
      notes: field(formData, "notes")
    });

    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Institution is invalid.");
      return;
    }

    saveInstitution(
      {
        name: result.data.name,
        websiteUrl: result.data.websiteUrl || undefined,
        notes: result.data.notes
      },
      editingInstitutionId ?? undefined
    );
    setEditingInstitutionId(null);
    setMessage("Institution saved.");
    form.reset();
  }

  function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = accountSchema.safeParse({
      institutionId: field(formData, "institutionId"),
      name: field(formData, "name"),
      maskedIdentifier: field(formData, "maskedIdentifier"),
      accountType: field(formData, "accountType"),
      accountGroup: field(formData, "accountGroup"),
      accountStatus: field(formData, "accountStatus"),
      liquidityClass: field(formData, "liquidityClass"),
      riskClass: field(formData, "riskClass"),
      trackingMethod: field(formData, "trackingMethod"),
      syncStatus: field(formData, "syncStatus"),
      dataQualityStatus: field(formData, "dataQualityStatus"),
      includeInNetWorth: formData.get("includeInNetWorth") === "on",
      includeInCashFlow: formData.get("includeInCashFlow") === "on",
      notes: field(formData, "notes")
    });

    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Account is invalid.");
      return;
    }

    saveAccount(
      {
        institutionId: result.data.institutionId,
        name: result.data.name,
        maskedIdentifier: result.data.maskedIdentifier || undefined,
        accountType: result.data.accountType as AccountType,
        accountGroup: result.data.accountGroup as AccountGroup,
        accountStatus: result.data.accountStatus as AccountStatus,
        liquidityClass: result.data.liquidityClass as LiquidityClass,
        riskClass: result.data.riskClass as RiskClass,
        trackingMethod: result.data.trackingMethod as TrackingMethod,
        syncStatus: result.data.syncStatus as SyncStatus,
        dataQualityStatus: result.data.dataQualityStatus as DataQualityStatus,
        includeInNetWorth: result.data.includeInNetWorth,
        includeInCashFlow: result.data.includeInCashFlow,
        notes: result.data.notes
      },
      editingAccountId ?? undefined
    );
    setEditingAccountId(null);
    setMessage("Account saved.");
    form.reset();
  }

  function submitBalance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = balanceSchema.safeParse({
      accountId: field(formData, "accountId"),
      balanceDate: field(formData, "balanceDate"),
      balanceAmount: field(formData, "balanceAmount"),
      currency: field(formData, "currency") || "USD",
      notes: field(formData, "notes")
    });

    if (!result.success) {
      setMessage(result.error.issues[0]?.message ?? "Balance is invalid.");
      return;
    }

    addBalance({
      accountId: result.data.accountId,
      balanceDate: result.data.balanceDate,
      balanceAmount: result.data.balanceAmount,
      currency: result.data.currency.toUpperCase(),
      notes: result.data.notes
    });
    setMessage("Balance entry saved.");
    form.reset();
  }

  return (
    <div>
      <SectionHeader
        title="Account Settings"
        description="Create institutions, manage accounts, classify tracking quality, and enter manual month-end balances."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={resetDemoData}
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Reset demo data
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-slate-950">
            {editingInstitution ? "Edit institution" : "Create institution"}
          </h2>
          <form
            key={editingInstitution?.id ?? "new-institution"}
            onSubmit={submitInstitution}
            className="mt-4 grid gap-4"
          >
            <label className="text-sm font-medium text-slate-700">
              Name
              <input
                name="name"
                defaultValue={editingInstitution?.name}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Website
              <input
                name="websiteUrl"
                defaultValue={editingInstitution?.websiteUrl}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Notes
              <textarea
                name="notes"
                defaultValue={editingInstitution?.notes}
                className="mt-1 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white"
            >
              <Save size={16} aria-hidden="true" />
              Save institution
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">Institutions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Website</th>
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {workspace.institutions.map((institution) => (
                  <tr key={institution.id} className="border-b border-slate-100">
                    <td className="py-3 pr-3 font-medium">{institution.name}</td>
                    <td className="py-3 pr-3 text-slate-600">
                      {institution.websiteUrl ?? "None"}
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => setEditingInstitutionId(institution.id)}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-slate-300 text-slate-700"
                        aria-label={`Edit ${institution.name}`}
                        title="Edit institution"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">
          {editingAccount ? "Edit account" : "Create account"}
        </h2>
        <form
          key={editingAccount?.id ?? "new-account"}
          onSubmit={submitAccount}
          className="mt-4 grid gap-4 lg:grid-cols-3"
        >
          <label className="text-sm font-medium text-slate-700">
            Institution
            <select
              name="institutionId"
              defaultValue={editingAccount?.institutionId ?? workspace.institutions[0]?.id}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-950"
            >
              {workspace.institutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Account name
            <input
              name="name"
              defaultValue={editingAccount?.name}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Mask
            <input
              name="maskedIdentifier"
              defaultValue={editingAccount?.maskedIdentifier}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Type
            <Select
              name="accountType"
              options={accountTypeOptions}
              defaultValue={editingAccount?.accountType}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Group
            <Select
              name="accountGroup"
              options={accountGroupOptions}
              defaultValue={editingAccount?.accountGroup}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Status
            <Select
              name="accountStatus"
              options={accountStatusOptions}
              defaultValue={editingAccount?.accountStatus}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Liquidity
            <Select
              name="liquidityClass"
              options={liquidityClassOptions}
              defaultValue={editingAccount?.liquidityClass}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Risk
            <Select
              name="riskClass"
              options={riskClassOptions}
              defaultValue={editingAccount?.riskClass}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Tracking
            <Select
              name="trackingMethod"
              options={trackingMethodOptions}
              defaultValue={editingAccount?.trackingMethod}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Sync
            <Select
              name="syncStatus"
              options={syncStatusOptions}
              defaultValue={editingAccount?.syncStatus}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Data quality
            <Select
              name="dataQualityStatus"
              options={dataQualityStatusOptions}
              defaultValue={editingAccount?.dataQualityStatus}
            />
          </label>
          <div className="flex flex-col gap-3 pt-6 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input
                name="includeInNetWorth"
                type="checkbox"
                defaultChecked={editingAccount?.includeInNetWorth ?? true}
              />
              Include in net worth
            </label>
            <label className="flex items-center gap-2">
              <input
                name="includeInCashFlow"
                type="checkbox"
                defaultChecked={editingAccount?.includeInCashFlow ?? true}
              />
              Include in cash flow
            </label>
          </div>
          <label className="text-sm font-medium text-slate-700 lg:col-span-3">
            Notes
            <textarea
              name="notes"
              defaultValue={editingAccount?.notes}
              className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white lg:col-span-3"
          >
            <Plus size={16} aria-hidden="true" />
            Save account
          </button>
        </form>
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">Accounts</h2>
        {accountRows.length === 0 ? (
          <EmptyState title="No accounts yet">Create an account to begin tracking balances.</EmptyState>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Account</th>
                  <th className="py-2 pr-3">Institution</th>
                  <th className="py-2 pr-3">Latest balance</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Type</th>
                  <th className="py-2 pr-3">Tracking</th>
                  <th className="py-2 pr-3">Sync</th>
                  <th className="py-2 pr-3">Quality</th>
                  <th className="py-2 pr-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {accountRows.map(({ account, latestBalance, institution }) => (
                  <tr key={account.id} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium">{account.name}</td>
                    <td className="py-3 pr-3 text-slate-600">
                      {institution?.name ?? "Unknown"}
                    </td>
                    <td className="py-3 pr-3">
                      {latestBalance
                        ? formatCurrency(
                            latestBalance.balanceAmount,
                            latestBalance.currency
                          )
                        : "No balance"}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={account.accountStatus} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={account.accountType} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={account.trackingMethod} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={account.syncStatus} />
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge value={account.dataQualityStatus} />
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        onClick={() => setEditingAccountId(account.id)}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-slate-300 text-slate-700"
                        aria-label={`Edit ${account.name}`}
                        title="Edit account"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Manual monthly balance entry
        </h2>
        <form onSubmit={submitBalance} className="mt-4 grid gap-4 lg:grid-cols-5">
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
            Date
            <input
              type="date"
              name="balanceDate"
              defaultValue="2026-05-31"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Amount
            <input
              type="number"
              step="0.01"
              name="balanceAmount"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Currency
            <input
              name="currency"
              defaultValue="USD"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase outline-none focus:border-slate-950"
            />
          </label>
          <label className="text-sm font-medium text-slate-700 lg:col-span-5">
            Notes
            <input
              name="notes"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-950"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white lg:col-span-5"
          >
            <Save size={16} aria-hidden="true" />
            Save balance
          </button>
        </form>
      </Card>

      <Card className="mt-5">
        <h2 className="text-lg font-semibold text-slate-950">
          Recent balance entries
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-3">Account</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentBalances.map(({ balance, account }) => (
                <tr key={balance.id} className="border-b border-slate-100">
                  <td className="py-3 pr-3 font-medium">
                    {account?.name ?? "Unknown account"}
                  </td>
                  <td className="py-3 pr-3">{balance.balanceDate}</td>
                  <td className="py-3 pr-3">
                    {formatCurrency(balance.balanceAmount, balance.currency)}
                  </td>
                  <td className="py-3 pr-3 text-slate-600">
                    {balance.notes ?? "None"}
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
