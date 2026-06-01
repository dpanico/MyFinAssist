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
} from "./types";

export interface Option<T extends string> {
  value: T;
  label: string;
}

export const accountTypeOptions: Option<AccountType>[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "credit_card", label: "Credit Card" },
  { value: "taxable_brokerage", label: "Taxable Brokerage" },
  { value: "robo_investor", label: "Robo Investor" },
  { value: "crypto", label: "Crypto" },
  { value: "401k", label: "401k" },
  { value: "457b", label: "457b" },
  { value: "ira", label: "IRA" },
  { value: "hsa", label: "HSA" },
  { value: "pension", label: "Pension" },
  { value: "mortgage", label: "Mortgage" },
  { value: "student_loan", label: "Student Loan" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "property", label: "Property" },
  { value: "other_asset", label: "Other Asset" },
  { value: "other_liability", label: "Other Liability" }
];

export const accountGroupOptions: Option<AccountGroup>[] = [
  { value: "cash", label: "Cash" },
  { value: "taxable_investments", label: "Taxable Investments" },
  { value: "retirement", label: "Retirement" },
  { value: "hsa", label: "HSA" },
  { value: "crypto", label: "Crypto" },
  { value: "property", label: "Property" },
  { value: "debt", label: "Debt" },
  { value: "credit_cards", label: "Credit Cards" },
  { value: "other", label: "Other" }
];

export const accountStatusOptions: Option<AccountStatus>[] = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" }
];

export const liquidityClassOptions: Option<LiquidityClass>[] = [
  { value: "operating_cash", label: "Operating Cash" },
  { value: "emergency_cash", label: "Emergency Cash" },
  { value: "invested_accessible", label: "Invested Accessible" },
  { value: "volatile_asset", label: "Volatile Asset" },
  { value: "retirement_restricted", label: "Retirement Restricted" },
  { value: "tax_advantaged_health", label: "Tax-Advantaged Health" },
  { value: "debt", label: "Debt" },
  { value: "other", label: "Other" }
];

export const riskClassOptions: Option<RiskClass>[] = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "moderate", label: "Moderate" },
  { value: "high", label: "High" },
  { value: "volatile", label: "Volatile" },
  { value: "debt", label: "Debt" }
];

export const trackingMethodOptions: Option<TrackingMethod>[] = [
  { value: "manual_balance", label: "Manual Balance" },
  { value: "manual_full", label: "Manual Full" },
  { value: "csv_import", label: "CSV Import" },
  { value: "full_sync", label: "Full Sync" },
  { value: "balance_sync", label: "Balance Sync" },
  { value: "transaction_sync", label: "Transaction Sync" },
  { value: "holdings_sync", label: "Holdings Sync" },
  { value: "statement_upload", label: "Statement Upload" },
  { value: "unsupported", label: "Unsupported" }
];

export const syncStatusOptions: Option<SyncStatus>[] = [
  { value: "manual", label: "Manual" },
  { value: "syncing", label: "Syncing" },
  { value: "sync_error", label: "Sync Error" },
  { value: "balance_only", label: "Balance Only" },
  { value: "transaction_only", label: "Transaction Only" },
  { value: "holdings_only", label: "Holdings Only" },
  { value: "full_sync", label: "Full Sync" },
  { value: "unsupported", label: "Unsupported" }
];

export const dataQualityStatusOptions: Option<DataQualityStatus>[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "partial", label: "Partial" },
  { value: "poor", label: "Poor" },
  { value: "manual", label: "Manual" },
  { value: "unsupported", label: "Unsupported" },
  { value: "unknown", label: "Unknown" }
];

export const transactionTypeOptions: Option<TransactionType>[] = [
  { value: "income", label: "Income" },
  { value: "true_expense", label: "True Expense" },
  { value: "transfer", label: "Transfer" },
  { value: "internal_payment", label: "Internal Payment" },
  { value: "investment_contribution", label: "Investment Contribution" },
  { value: "investment_withdrawal", label: "Investment Withdrawal" },
  { value: "debt_payment", label: "Debt Payment" },
  { value: "refund", label: "Refund" },
  { value: "reimbursement", label: "Reimbursement" },
  { value: "fee", label: "Fee" },
  { value: "interest", label: "Interest" },
  { value: "dividend", label: "Dividend" },
  { value: "uncategorized", label: "Uncategorized" }
];

export const documentTypeOptions: Option<DocumentType>[] = [
  { value: "bank_statement", label: "Bank Statement" },
  { value: "credit_card_statement", label: "Credit Card Statement" },
  { value: "brokerage_statement", label: "Brokerage Statement" },
  { value: "retirement_statement", label: "Retirement Statement" },
  { value: "hsa_statement", label: "HSA Statement" },
  { value: "loan_statement", label: "Loan Statement" },
  { value: "mortgage_statement", label: "Mortgage Statement" },
  { value: "crypto_statement", label: "Crypto Statement" },
  { value: "other", label: "Other" }
];

export const reviewStatusOptions: Option<ReviewStatus>[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "edited", label: "Edited" },
  { value: "rejected", label: "Rejected" },
  { value: "ignored", label: "Ignored" }
];

export const defaultCategorySeed: Option<TransactionType>[] = [
  { label: "Dining", value: "true_expense" },
  { label: "Groceries", value: "true_expense" },
  { label: "Merchandise", value: "true_expense" },
  { label: "Travel", value: "true_expense" },
  { label: "Lodging", value: "true_expense" },
  { label: "Entertainment", value: "true_expense" },
  { label: "Gas / Automotive", value: "true_expense" },
  { label: "Mortgage", value: "debt_payment" },
  { label: "Student Loans", value: "debt_payment" },
  { label: "Utilities", value: "true_expense" },
  { label: "Subscriptions", value: "true_expense" },
  { label: "Insurance", value: "true_expense" },
  { label: "Medical", value: "true_expense" },
  { label: "Rent", value: "true_expense" },
  { label: "Income", value: "income" },
  { label: "Investment Contribution", value: "investment_contribution" },
  { label: "Credit Card Payment", value: "internal_payment" },
  { label: "Transfer", value: "transfer" },
  { label: "Reimbursement", value: "reimbursement" },
  { label: "Refund", value: "refund" },
  { label: "Fees", value: "fee" },
  { label: "Interest", value: "interest" },
  { label: "Dividends", value: "dividend" },
  { label: "Other", value: "uncategorized" }
];
