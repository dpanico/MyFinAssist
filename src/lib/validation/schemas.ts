import { z } from "zod";

export const institutionSchema = z.object({
  name: z.string().trim().min(2, "Institution name is required"),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
  notes: z.string().trim().optional()
});

export const accountSchema = z.object({
  institutionId: z.string().min(1, "Institution is required"),
  name: z.string().trim().min(2, "Account name is required"),
  maskedIdentifier: z.string().trim().optional(),
  accountType: z.string().min(1),
  accountGroup: z.string().min(1),
  accountStatus: z.string().min(1),
  liquidityClass: z.string().min(1),
  riskClass: z.string().min(1),
  trackingMethod: z.string().min(1),
  syncStatus: z.string().min(1),
  dataQualityStatus: z.string().min(1),
  includeInNetWorth: z.boolean(),
  includeInCashFlow: z.boolean(),
  notes: z.string().trim().optional()
});

export const balanceSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  balanceDate: z.string().min(1, "Balance date is required"),
  balanceAmount: z.coerce.number().finite(),
  currency: z.string().trim().length(3).default("USD"),
  notes: z.string().trim().optional()
});

export const transactionSchema = z.object({
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional(),
  transactionDate: z.string().min(1, "Transaction date is required"),
  postedDate: z.string().optional(),
  description: z.string().trim().min(2, "Description is required"),
  merchant: z.string().trim().optional(),
  amount: z.coerce.number().finite(),
  currency: z.string().trim().length(3).default("USD"),
  transactionType: z.string().min(1, "Transaction type is required"),
  notes: z.string().trim().optional()
});

export const statementSchema = z
  .object({
    accountId: z.string().min(1, "Account is required"),
    documentType: z.string().min(1),
    periodStart: z.string().min(1, "Start date is required"),
    periodEnd: z.string().min(1, "End date is required"),
    fileName: z.string().trim().min(3, "File name is required")
  })
  .refine((value) => value.periodEnd >= value.periodStart, {
    message: "Statement end date must be on or after start date",
    path: ["periodEnd"]
  });
