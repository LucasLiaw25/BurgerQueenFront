import { ProductResponse } from "./food.model";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  couponCode: string[]; 
}

export interface OrderItemResponse{
    productId: number;
    product: ProductResponse;
    quantity: number;
    priceAtTime: number;
}

export interface OrderResponse {
  id: number;
  productName: string;
  imageUrl: string;
  amount: number;
  status: string;
}

export interface OrderDTO {
    id: number;
    items: OrderItemResponse[];
    amount: number;
    status: string;
}