import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { OrderDTO } from '../models/order.model';
import { FoodService } from './food.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private foodService: FoodService, private http:HttpClient) {
    this.refreshCartCount();
  }

  private apiUrl = "http://localhost:8080/api";
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  refreshCartCount() {
    this.foodService.getCurrentPendingOrder().subscribe({
      next: (order) => {
        const totalItems = order.items.reduce((acc, item) => acc + item.quantity, 0);
        this.cartCountSubject.next(totalItems);
      },
      error: () => this.cartCountSubject.next(0)
    });
  }

  updateCount(count: number) {
    this.cartCountSubject.next(count);
  }

  getCompletedOrders(): Observable<OrderDTO[]> {
    return this.http.get<OrderDTO[]>(`${this.apiUrl}/orders/completed`);
  }

  getPreparingOrder(): Observable<OrderDTO> {
    return this.http.get<OrderDTO>(`${this.apiUrl}/orders/preparing`);
  }

  getUserName(): Observable<string> {
   return this.http.get(`${this.apiUrl}/orders/username`, { responseType: 'text' });
  } 

  private cartVisible = new BehaviorSubject<boolean>(false);
  cartVisible$ = this.cartVisible.asObservable();

  toggleCart() {
    this.cartVisible.next(!this.cartVisible.value);
    if (this.cartVisible.value) {
      this.refreshCartCount(); // Atualiza os dados ao abrir
    }
  }

  removeItem(productId: number): Observable<OrderDTO> {
  const options = {
    body: { productId: productId } 
  };

  return this.http.delete<OrderDTO>(`${this.apiUrl}/orders/remove-item`, options).pipe(
    tap(() => this.refreshCartCount()) 
  );
}

}


