export type AddressType = 'HOME' | 'WORK' | 'OTHER';

export interface Address {
  id: number;
  userId: number;
  isSelected: boolean;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  type: AddressType;
  isActive: boolean;
}

export interface CreateAddressRequest {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  postalCode: string;
  type?: AddressType;
}
