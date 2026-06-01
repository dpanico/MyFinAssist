"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type AccountRecord,
  type BalanceRecord,
  type FinanceWorkspace,
  type InstitutionRecord,
  type UploadedDocumentRecord,
  initialWorkspace
} from "@/lib/demo-data/workspace";
import type { ReviewStatus } from "@/lib/finance/types";

const STORAGE_KEY = "myfinassist.phase1.workspace";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadWorkspace() {
  if (typeof window === "undefined") {
    return initialWorkspace;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return initialWorkspace;
  }

  try {
    return JSON.parse(stored) as FinanceWorkspace;
  } catch {
    return initialWorkspace;
  }
}

export function useFinanceWorkspace() {
  const [workspace, setWorkspace] = useState<FinanceWorkspace>(() => loadWorkspace());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    }
  }, [workspace]);

  const latestBalances = useMemo(() => {
    return workspace.accounts.map((account) => {
      const latest = workspace.balances
        .filter((balance) => balance.accountId === account.id)
        .sort((a, b) => b.balanceDate.localeCompare(a.balanceDate))[0];

      return {
        account,
        latestBalance: latest ?? null
      };
    });
  }, [workspace.accounts, workspace.balances]);

  function saveInstitution(input: Omit<InstitutionRecord, "id">, id?: string) {
    setWorkspace((current) => {
      if (id) {
        return {
          ...current,
          institutions: current.institutions.map((institution) =>
            institution.id === id ? { ...institution, ...input } : institution
          )
        };
      }

      return {
        ...current,
        institutions: [
          ...current.institutions,
          {
            id: createId("inst"),
            ...input
          }
        ]
      };
    });
  }

  function saveAccount(input: Omit<AccountRecord, "id">, id?: string) {
    setWorkspace((current) => {
      if (id) {
        return {
          ...current,
          accounts: current.accounts.map((account) =>
            account.id === id ? { ...account, ...input } : account
          )
        };
      }

      return {
        ...current,
        accounts: [
          ...current.accounts,
          {
            id: createId("acct"),
            ...input
          }
        ]
      };
    });
  }

  function addBalance(input: Omit<BalanceRecord, "id">) {
    setWorkspace((current) => ({
      ...current,
      balances: [
        {
          id: createId("bal"),
          ...input
        },
        ...current.balances
      ]
    }));
  }

  function addMockStatement(input: Omit<UploadedDocumentRecord, "id" | "reviewStatus">) {
    const documentId = createId("doc");

    setWorkspace((current) => ({
      ...current,
      uploadedDocuments: [
        {
          id: documentId,
          reviewStatus: "pending",
          ...input
        },
        ...current.uploadedDocuments
      ],
      extractedStatementItems: [
        {
          id: createId("extract"),
          documentId,
          itemType: "ending_balance",
          label: "Mock ending balance",
          extractedValue: "$1,250.00",
          normalizedValue: 1250,
          reviewStatus: "pending"
        },
        {
          id: createId("extract"),
          documentId,
          itemType: "period",
          label: "Mock statement period",
          extractedValue: `${input.periodStart} to ${input.periodEnd}`,
          normalizedValue: null,
          reviewStatus: "pending"
        },
        ...current.extractedStatementItems
      ]
    }));
  }

  function updateExtractionStatus(itemId: string, reviewStatus: ReviewStatus) {
    setWorkspace((current) => ({
      ...current,
      extractedStatementItems: current.extractedStatementItems.map((item) =>
        item.id === itemId ? { ...item, reviewStatus } : item
      )
    }));
  }

  function resetDemoData() {
    setWorkspace(initialWorkspace);
  }

  return {
    workspace,
    latestBalances,
    saveInstitution,
    saveAccount,
    addBalance,
    addMockStatement,
    updateExtractionStatus,
    resetDemoData
  };
}
