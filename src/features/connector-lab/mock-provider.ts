import type { ConnectorCapabilityReport, ProviderAdapter } from "./types";

const generatedAt = "2026-06-01T00:00:00.000Z";

export function getMockConnectorReport(): ConnectorCapabilityReport {
  return {
    providerName: "Mock Provider",
    generatedAt,
    summary:
      "Demo-only capability report showing how future providers will describe account coverage.",
    accounts: [
      {
        id: "mock-checking",
        providerName: "Mock Provider",
        institutionName: "Northstar Credit Union",
        accountName: "Everyday Checking",
        accountType: "checking",
        connectionStatus: "connected",
        lastSuccessfulSync: "2026-05-31",
        hasCurrentBalance: true,
        hasTransactions: true,
        transactionHistoryMonths: 24,
        hasCategoryData: true,
        hasMerchantData: true,
        hasHoldings: false,
        hasInvestmentTransactions: false,
        hasContributionWithdrawalData: false,
        hasWebhookRefresh: true,
        reauthenticationRequired: false,
        syncErrors: [],
        recommendedTrackingMethod: "full_sync",
        dataQualityStatus: "excellent"
      },
      {
        id: "mock-credit-card",
        providerName: "Mock Provider",
        institutionName: "Summit Card Services",
        accountName: "Rewards Card",
        accountType: "credit_card",
        connectionStatus: "partial",
        lastSuccessfulSync: "2026-05-30",
        hasCurrentBalance: true,
        hasTransactions: true,
        transactionHistoryMonths: 12,
        hasCategoryData: false,
        hasMerchantData: true,
        hasHoldings: false,
        hasInvestmentTransactions: false,
        hasContributionWithdrawalData: false,
        hasWebhookRefresh: false,
        reauthenticationRequired: false,
        syncErrors: ["Provider categories are unavailable in mock mode."],
        recommendedTrackingMethod: "transaction_sync",
        dataQualityStatus: "good"
      },
      {
        id: "mock-brokerage",
        providerName: "Mock Provider",
        institutionName: "Cedar Brokerage",
        accountName: "Taxable Investing",
        accountType: "taxable_brokerage",
        connectionStatus: "partial",
        lastSuccessfulSync: "2026-05-29",
        hasCurrentBalance: true,
        hasTransactions: false,
        transactionHistoryMonths: 0,
        hasCategoryData: false,
        hasMerchantData: false,
        hasHoldings: true,
        hasInvestmentTransactions: true,
        hasContributionWithdrawalData: true,
        hasWebhookRefresh: false,
        reauthenticationRequired: false,
        syncErrors: [],
        recommendedTrackingMethod: "holdings_sync",
        dataQualityStatus: "partial"
      },
      {
        id: "mock-mortgage",
        providerName: "Mock Provider",
        institutionName: "Harbor Home Loans",
        accountName: "Primary Mortgage",
        accountType: "mortgage",
        connectionStatus: "manual_only",
        lastSuccessfulSync: null,
        hasCurrentBalance: false,
        hasTransactions: false,
        transactionHistoryMonths: 0,
        hasCategoryData: false,
        hasMerchantData: false,
        hasHoldings: false,
        hasInvestmentTransactions: false,
        hasContributionWithdrawalData: false,
        hasWebhookRefresh: false,
        reauthenticationRequired: false,
        syncErrors: ["Mock provider cannot read this loan account."],
        recommendedTrackingMethod: "statement_upload",
        dataQualityStatus: "manual"
      },
      {
        id: "mock-crypto",
        providerName: "Mock Provider",
        institutionName: "Example Crypto Vault",
        accountName: "Crypto Holdings",
        accountType: "crypto",
        connectionStatus: "unsupported",
        lastSuccessfulSync: null,
        hasCurrentBalance: false,
        hasTransactions: false,
        transactionHistoryMonths: 0,
        hasCategoryData: false,
        hasMerchantData: false,
        hasHoldings: false,
        hasInvestmentTransactions: false,
        hasContributionWithdrawalData: false,
        hasWebhookRefresh: false,
        reauthenticationRequired: false,
        syncErrors: ["No mock adapter coverage for this platform."],
        recommendedTrackingMethod: "manual_balance",
        dataQualityStatus: "unknown"
      }
    ]
  };
}

export const mockProviderAdapter: ProviderAdapter = {
  name: "Mock Provider",
  getCapabilityReport: getMockConnectorReport
};
