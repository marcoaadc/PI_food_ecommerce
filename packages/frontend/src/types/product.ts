export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  category: string;
  isActive: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
