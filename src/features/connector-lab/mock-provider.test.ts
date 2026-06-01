import { describe, expect, it } from "vitest";
import { getMockConnectorReport } from "./mock-provider";

describe("getMockConnectorReport", () => {
  it("returns explicit tracking and quality recommendations for mixed account capabilities", () => {
    const report = getMockConnectorReport();

    expect(report.providerName).toBe("Mock Provider");
    expect(report.accounts).toHaveLength(5);
    expect(report.accounts.map((account) => account.recommendedTrackingMethod)).toContain("full_sync");
    expect(report.accounts.map((account) => account.recommendedTrackingMethod)).toContain("statement_upload");
    expect(report.accounts.every((account) => account.dataQualityStatus)).toBe(true);
  });
});
