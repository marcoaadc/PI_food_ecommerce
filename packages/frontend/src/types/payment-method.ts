export type CardBrand = 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX';

export interface PaymentMethod {
  id: number;
  userId: number;
  isSelected: boolean;
  brand: CardBrand;
  lastFourDigits: string;
  expirationMonth: number;
  expirationYear: number;
  holderName: string;
  isActive: boolean;
}

export interface CreatePaymentMethodRequest {
  brand: CardBrand;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
  holderName: string;
}
