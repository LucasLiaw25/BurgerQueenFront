export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  rating: number;
  ratingCount: number;
}

export interface ProductResponse {
    id: number;
    name: string;
    price: number;
    imageUrl: string; 
}

export interface CouponProduct extends Product {
  discountedPrice: number;
}