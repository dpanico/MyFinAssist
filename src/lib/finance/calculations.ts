import type {
  AccountGroup,
  CashFlowTransactionInput,
  InvestmentPerformanceInput,
  NetWorthAccountInput
} from "./types";

const LIABILITY_GROUPS = new Set<AccountGroup>(["debt", "credit_cards"]);

export function isLiabilityGroup(group: AccountGroup) {
  return LIABILITY_GROUPS.has(group);
}

export function calculateNetWorth(accounts: NetWorthAccountInput[]) {
  return accounts.reduce(
    (summary, account) => {
      if (!account.includeInNetWorth) {
        return summary;
      }

      const amount = Math.abs(account.balance);

      if (isLiabilityGroup(account.group)) {
        summary.liabilities += amount;
        summary.netWorth -= amount;
      } else {
        summary.assets += amount;
        summary.netWorth += amount;
      }

      return summary;
    },
    { assets: 0, liabilities: 0, netWorth: 0 }
  );
}

export function calculateFreeCashFlow(transactions: CashFlowTransactionInput[]) {
  return transactions.reduce(
    (summary, transaction) => {
      const amount = Math.abs(transaction.amount);

      switch (transaction.type) {
        case "income":
        case "refund":
        case "reimbursement":
        case "interest":
        case "dividend":
          summary.income += amount;
          break;
        case "true_expense":
        case "fee":
          summary.trueExpenses += amount;
          break;
        case "debt_payment":
          summary.debtPayments += amount;
          break;
        case "investment_contribution":
          summary.investmentContributions += amount;
          break;
        case "investment_withdrawal":
          summary.investmentWithdrawals += amount;
          break;
        case "transfer":
        case "internal_payment":
          summary.transfersAndInternalPayments += amount;
          break;
        case "uncategorized":
          summary.uncategorized += amount;
          break;
      }

      summary.freeCashFlow =
        summary.income - summary.trueExpenses - summary.debtPayments;

      return summary;
    },
    {
      income: 0,
      trueExpenses: 0,
      debtPayments: 0,
      investmentContributions: 0,
      investmentWithdrawals: 0,
      transfersAndInternalPayments: 0,
      uncategorized: 0,
      freeCashFlow: 0
    }
  );
}

export function calculateEstimatedInvestmentPerformance(
  input: InvestmentPerformanceInput
) {
  const beginningBalance = input.beginningBalance ?? 0;
  const netContributions = input.contributions - input.withdrawals;
  const estimatedGrowth =
    input.endingBalance - beginningBalance - netContributions;

  if (beginningBalance <= 0) {
    return {
      netContributions,
      estimatedGrowth,
      estimatedReturn: null,
      returnStatus: "unavailable" as const
    };
  }

  return {
    netContributions,
    estimatedGrowth,
    estimatedReturn: estimatedGrowth / beginningBalance,
    returnStatus: "estimated" as const
  };
}
