import { ProductResponse } from "./food.model";

export interface CouponRequest{
    productId: number
}

export interface CouponResponse {
  code: string;
  expiresAt: string;
  discountPercentage: number;
  productId: number; 
  productName?: string; 
}

export interface CouponProductRequest{
  code: string
}

export interface CouponProductResponse {
    product: ProductResponse;
}