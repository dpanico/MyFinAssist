import { describe, expect, it } from "vitest";
import {
  calculateEstimatedInvestmentPerformance,
  calculateFreeCashFlow,
  calculateNetWorth
} from "./calculations";

describe("calculateNetWorth", () => {
  it("adds assets, subtracts liabilities, and excludes opted-out accounts", () => {
    const result = calculateNetWorth([
      {
        id: "checking",
        group: "cash",
        balance: 2500,
        includeInNetWorth: true
      },
      {
        id: "brokerage",
        group: "taxable_investments",
        balance: 12000,
        includeInNetWorth: true
      },
      {
        id: "credit-card",
        group: "credit_cards",
        balance: 800,
        includeInNetWorth: true
      },
      {
        id: "excluded-property",
        group: "property",
        balance: 300000,
        includeInNetWorth: false
      }
    ]);

    expect(result.assets).toBe(14500);
    expect(result.liabilities).toBe(800);
    expect(result.netWorth).toBe(13700);
  });
});

describe("calculateFreeCashFlow", () => {
  it("excludes transfers and investment contributions from true expenses", () => {
    const result = calculateFreeCashFlow([
      { type: "income", amount: 6000 },
      { type: "true_expense", amount: 1800 },
      { type: "debt_payment", amount: 450 },
      { type: "investment_contribution", amount: 700 },
      { type: "internal_payment", amount: 1200 },
      { type: "transfer", amount: 500 }
    ]);

    expect(result.income).toBe(6000);
    expect(result.trueExpenses).toBe(1800);
    expect(result.debtPayments).toBe(450);
    expect(result.investmentContributions).toBe(700);
    expect(result.transfersAndInternalPayments).toBe(1700);
    expect(result.freeCashFlow).toBe(3750);
  });
});

describe("calculateEstimatedInvestmentPerformance", () => {
  it("separates contributions from estimated growth", () => {
    const result = calculateEstimatedInvestmentPerformance({
      beginningBalance: 10000,
      endingBalance: 11250,
      contributions: 800,
      withdrawals: 100
    });

    expect(result.netContributions).toBe(700);
    expect(result.estimatedGrowth).toBe(550);
    expect(result.estimatedReturn).toBe(0.055);
    expect(result.returnStatus).toBe("estimated");
  });

  it("does not calculate return when beginning balance is zero", () => {
    const result = calculateEstimatedInvestmentPerformance({
      beginningBalance: 0,
      endingBalance: 500,
      contributions: 500,
      withdrawals: 0
    });

    expect(result.estimatedGrowth).toBe(0);
    expect(result.estimatedReturn).toBeNull();
    expect(result.returnStatus).toBe("unavailable");
  });
});
