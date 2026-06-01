import type {
  AccountType,
  DataQualityStatus,
  TrackingMethod
} from "@/lib/finance/types";

export type ConnectionStatus =
  | "connected"
  | "partial"
  | "reauthorization_required"
  | "manual_only"
  | "unsupported";

export interface ConnectorCapabilityAccount {
  id: string;
  providerName: string;
  institutionName: string;
  accountName: string;
  accountType: AccountType;
  connectionStatus: ConnectionStatus;
  lastSuccessfulSync: string | null;
  hasCurrentBalance: boolean;
  hasTransactions: boolean;
  transactionHistoryMonths: number;
  hasCategoryData: boolean;
  hasMerchantData: boolean;
  hasHoldings: boolean;
  hasInvestmentTransactions: boolean;
  hasContributionWithdrawalData: boolean;
  hasWebhookRefresh: boolean;
  reauthenticationRequired: boolean;
  syncErrors: string[];
  recommendedTrackingMethod: TrackingMethod;
  dataQualityStatus: DataQualityStatus;
}

export interface ConnectorCapabilityReport {
  providerName: string;
  generatedAt: string;
  summary: string;
  accounts: ConnectorCapabilityAccount[];
}

export interface ProviderAdapter {
  name: string;
  getCapabilityReport: () => ConnectorCapabilityReport;
}
