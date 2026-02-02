import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Category, Product, ProductResponse } from '../models/food.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CouponProductRequest, CouponProductResponse, CouponRequest, CouponResponse } from '../models/coupon.model';
import { OrderDTO, OrderItemRequest, OrderRequest, OrderResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient){}

  private apiUrl = "http://localhost:8080/api";

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products/`);
  }

  getCurrentPendingOrder():Observable<OrderDTO>{
      return this.http.get<OrderDTO>(`${this.apiUrl}/orders/pending`);
    }

  getProductByIdOrThrow(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    if (categoryId === 0) {
      return this.getProducts();
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products/category/${categoryId}`);
  }

  createCoupon(request: CouponRequest): Observable<CouponResponse>{
    return this.http.post<CouponResponse>(`${this.apiUrl}/coupons/`, request);
  }

  searchMovie(params: any): Observable<Product[]> {
  let httpParams = new HttpParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    }
  }

  console.log('🌐 URL completa:', `${this.apiUrl}search?${httpParams.toString()}`);
  
    return this.http.get<Product[]>(`${this.apiUrl}/products/search`, { 
      params: httpParams,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(results => console.log('📦 Dados recebidos do backend:', results))
    );
  }

  createOrder(request:OrderRequest):Observable<OrderResponse>{
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders/`, request);
  }

  getProductByCoupon(code: string): Observable<CouponProductResponse> {
  return this.http.get<CouponProductResponse>(`${this.apiUrl}/coupons/code`, {
    params: { code }
  });
}

}
