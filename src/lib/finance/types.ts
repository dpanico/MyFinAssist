export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "taxable_brokerage"
  | "robo_investor"
  | "crypto"
  | "401k"
  | "457b"
  | "ira"
  | "hsa"
  | "pension"
  | "mortgage"
  | "student_loan"
  | "personal_loan"
  | "property"
  | "other_asset"
  | "other_liability";

export type AccountGroup =
  | "cash"
  | "taxable_investments"
  | "retirement"
  | "hsa"
  | "crypto"
  | "property"
  | "debt"
  | "credit_cards"
  | "other";

export type AccountStatus = "active" | "closed" | "archived";

export type LiquidityClass =
  | "operating_cash"
  | "emergency_cash"
  | "invested_accessible"
  | "volatile_asset"
  | "retirement_restricted"
  | "tax_advantaged_health"
  | "debt"
  | "other";

export type RiskClass =
  | "none"
  | "low"
  | "moderate"
  | "high"
  | "volatile"
  | "debt";

export type TrackingMethod =
  | "manual_balance"
  | "manual_full"
  | "csv_import"
  | "full_sync"
  | "balance_sync"
  | "transaction_sync"
  | "holdings_sync"
  | "statement_upload"
  | "unsupported";

export type SyncStatus =
  | "manual"
  | "syncing"
  | "sync_error"
  | "balance_only"
  | "transaction_only"
  | "holdings_only"
  | "full_sync"
  | "unsupported";

export type DataQualityStatus =
  | "excellent"
  | "good"
  | "partial"
  | "poor"
  | "manual"
  | "unsupported"
  | "unknown";

export type TransactionType =
  | "income"
  | "true_expense"
  | "transfer"
  | "internal_payment"
  | "investment_contribution"
  | "investment_withdrawal"
  | "debt_payment"
  | "refund"
  | "reimbursement"
  | "fee"
  | "interest"
  | "dividend"
  | "uncategorized";

export type TransferMatchStatus = "pending" | "approved" | "rejected";

export type DocumentType =
  | "bank_statement"
  | "credit_card_statement"
  | "brokerage_statement"
  | "retirement_statement"
  | "hsa_statement"
  | "loan_statement"
  | "mortgage_statement"
  | "crypto_statement"
  | "other";

export type ReviewStatus =
  | "pending"
  | "approved"
  | "edited"
  | "rejected"
  | "ignored";

export interface NetWorthAccountInput {
  id: string;
  group: AccountGroup;
  balance: number;
  includeInNetWorth: boolean;
}

export interface CashFlowTransactionInput {
  type: TransactionType;
  amount: number;
}

export interface InvestmentPerformanceInput {
  beginningBalance: number | null;
  endingBalance: number;
  contributions: number;
  withdrawals: number;
}
