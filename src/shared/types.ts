import z from "zod";

export interface ApiSuccessResponse<T = unknown> {
    status: true;
    data: T;
}

export interface Errors {
    path: string | undefined;
    message: string;
}
export const STATUS = ["PENDING", "ACTIVE", "FAVOURITE", "BLOCK", "DELETE"] as const;
export const ROLE = ["MEMBER", "ADMIN", "SUPER_ADMIN", "OWNER", "DEVELOPER"] as const;
export const Day = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

export const RoleEnumSchema = z.enum(ROLE);
export const StatusEnumSchema = z.enum(STATUS);
export const DayEnumSchema = z.enum(Day);

export type RoleEnumDTO = z.infer<typeof RoleEnumSchema>;
export type StatusEnumDTO = z.infer<typeof StatusEnumSchema>;
export type DayEnumDTO = z.infer<typeof DayEnumSchema>;

export const TypeService = ["SERVICE", "PRODUCT"] as const;
export const TypeServiceEnumSchema = z.enum(TypeService);
export type TypeServiceEnumDTO = z.infer<typeof TypeServiceEnumSchema>;

// 1. Payment Method
export const PaymentMethod = [
    "CASH",
    "TRANSFER",
    "DEBIT",
    "CREDIT_CARD",
    "QRIS",
    "SHOPEE",
] as const;
export const PaymentMethodEnumSchema = z.enum(PaymentMethod);
export type PaymentMethodEnumDTO = z.infer<typeof PaymentMethodEnumSchema>;

// 2. Payment Status
export const PaymentStatus = ["PENDING", "PARTIAL", "PAID", "CANCELLED", "REFUNDED"] as const;
export const PaymentStatusEnumSchema = z.enum(PaymentStatus);
export type PaymentStatusEnumDTO = z.infer<typeof PaymentStatusEnumSchema>;

// 3. Transaction Type
export const TransactionType = ["INCOME", "EXPENSE"] as const;
export const TransactionTypeEnumSchema = z.enum(TransactionType);
export type TransactionTypeEnumDTO = z.infer<typeof TransactionTypeEnumSchema>;

export const TimeSchema = z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)");
