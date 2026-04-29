/**
 * Shared types and enums for the Burguer House monorepo.
 *
 * These enums mirror the Prisma schema definitions and can be used
 * by both backend and frontend packages to ensure type consistency.
 */

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SHOPKEEPER = 'SHOPKEEPER',
}

export enum OrderStatus {
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  OTHER = 'OTHER',
}

export enum CardBrand {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMEX = 'AMEX',
}
