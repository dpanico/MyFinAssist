import type {
  AccountGroup,
  AccountStatus,
  AccountType,
  DataQualityStatus,
  DocumentType,
  LiquidityClass,
  ReviewStatus,
  RiskClass,
  SyncStatus,
  TrackingMethod,
  TransactionType
} from "@/lib/finance/types";
import { defaultCategorySeed } from "@/lib/finance/options";

export interface InstitutionRecord {
  id: string;
  name: string;
  websiteUrl?: string;
  notes?: string;
}

export interface AccountRecord {
  id: string;
  institutionId: string;
  name: string;
  maskedIdentifier?: string;
  accountType: AccountType;
  accountGroup: AccountGroup;
  accountStatus: AccountStatus;
  liquidityClass: LiquidityClass;
  riskClass: RiskClass;
  trackingMethod: TrackingMethod;
  syncStatus: SyncStatus;
  dataQualityStatus: DataQualityStatus;
  includeInNetWorth: boolean;
  includeInCashFlow: boolean;
  notes?: string;
}

export interface BalanceRecord {
  id: string;
  accountId: string;
  balanceDate: string;
  balanceAmount: number;
  currency: string;
  notes?: string;
}

export interface CategoryRecord {
  id: string;
  name: string;
  transactionType: TransactionType;
  isDefault: boolean;
}

export interface UploadedDocumentRecord {
  id: string;
  accountId: string;
  documentType: DocumentType;
  periodStart: string;
  periodEnd: string;
  fileName: string;
  reviewStatus: ReviewStatus;
}

export interface ExtractedStatementItemRecord {
  id: string;
  documentId: string;
  itemType: string;
  label: string;
  extractedValue: string;
  normalizedValue: number | null;
  reviewStatus: ReviewStatus;
}

export interface FinanceWorkspace {
  institutions: InstitutionRecord[];
  accounts: AccountRecord[];
  balances: BalanceRecord[];
  categories: CategoryRecord[];
  uploadedDocuments: UploadedDocumentRecord[];
  extractedStatementItems: ExtractedStatementItemRecord[];
}

export const initialWorkspace: FinanceWorkspace = {
  institutions: [
    {
      id: "inst-northstar",
      name: "Northstar Credit Union",
      websiteUrl: "https://example.invalid/northstar",
      notes: "Fake demo institution for operating cash."
    },
    {
      id: "inst-cedar",
      name: "Cedar Brokerage",
      websiteUrl: "https://example.invalid/cedar",
      notes: "Fake demo institution for investments."
    },
    {
      id: "inst-harbor",
      name: "Harbor Home Loans",
      websiteUrl: "https://example.invalid/harbor",
      notes: "Fake demo institution for statement-based loan tracking."
    }
  ],
  accounts: [
    {
      id: "acct-checking",
      institutionId: "inst-northstar",
      name: "Everyday Checking",
      maskedIdentifier: "0001",
      accountType: "checking",
      accountGroup: "cash",
      accountStatus: "active",
      liquidityClass: "operating_cash",
      riskClass: "low",
      trackingMethod: "manual_full",
      syncStatus: "manual",
      dataQualityStatus: "manual",
      includeInNetWorth: true,
      includeInCashFlow: true
    },
    {
      id: "acct-savings",
      institutionId: "inst-northstar",
      name: "Emergency Savings",
      maskedIdentifier: "0002",
      accountType: "savings",
      accountGroup: "cash",
      accountStatus: "active",
      liquidityClass: "emergency_cash",
      riskClass: "low",
      trackingMethod: "manual_balance",
      syncStatus: "manual",
      dataQualityStatus: "manual",
      includeInNetWorth: true,
      includeInCashFlow: true
    },
    {
      id: "acct-brokerage",
      institutionId: "inst-cedar",
      name: "Taxable Investing",
      maskedIdentifier: "0003",
      accountType: "taxable_brokerage",
      accountGroup: "taxable_investments",
      accountStatus: "active",
      liquidityClass: "invested_accessible",
      riskClass: "moderate",
      trackingMethod: "statement_upload",
      syncStatus: "manual",
      dataQualityStatus: "partial",
      includeInNetWorth: true,
      includeInCashFlow: false
    },
    {
      id: "acct-mortgage",
      institutionId: "inst-harbor",
      name: "Primary Mortgage",
      maskedIdentifier: "0004",
      accountType: "mortgage",
      accountGroup: "debt",
      accountStatus: "active",
      liquidityClass: "debt",
      riskClass: "debt",
      trackingMethod: "statement_upload",
      syncStatus: "manual",
      dataQualityStatus: "manual",
      includeInNetWorth: true,
      includeInCashFlow: true
    }
  ],
  balances: [
    {
      id: "bal-checking-may",
      accountId: "acct-checking",
      balanceDate: "2026-05-31",
      balanceAmount: 4250.25,
      currency: "USD"
    },
    {
      id: "bal-savings-may",
      accountId: "acct-savings",
      balanceDate: "2026-05-31",
      balanceAmount: 18000,
      currency: "USD"
    },
    {
      id: "bal-brokerage-may",
      accountId: "acct-brokerage",
      balanceDate: "2026-05-31",
      balanceAmount: 64250.4,
      currency: "USD"
    },
    {
      id: "bal-mortgage-may",
      accountId: "acct-mortgage",
      balanceDate: "2026-05-31",
      balanceAmount: 268900,
      currency: "USD"
    }
  ],
  categories: defaultCategorySeed.map((category, index) => ({
    id: `cat-${index + 1}`,
    name: category.label,
    transactionType: category.value,
    isDefault: true
  })),
  uploadedDocuments: [
    {
      id: "doc-brokerage-may",
      accountId: "acct-brokerage",
      documentType: "brokerage_statement",
      periodStart: "2026-05-01",
      periodEnd: "2026-05-31",
      fileName: "cedar-brokerage-demo-may-2026.pdf",
      reviewStatus: "pending"
    }
  ],
  extractedStatementItems: [
    {
      id: "extract-ending-balance",
      documentId: "doc-brokerage-may",
      itemType: "ending_balance",
      label: "Ending value",
      extractedValue: "$64,250.40",
      normalizedValue: 64250.4,
      reviewStatus: "pending"
    },
    {
      id: "extract-contribution",
      documentId: "doc-brokerage-may",
      itemType: "contribution",
      label: "May contribution",
      extractedValue: "$700.00",
      normalizedValue: 700,
      reviewStatus: "pending"
    }
  ]
};
