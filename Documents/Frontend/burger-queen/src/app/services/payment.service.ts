import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDTO } from '../models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private http: HttpClient
  ){}

  private apiUrl = "http://localhost:8080/api";

  createPixPayment(orderId:number): Observable<PaymentDTO>{
    return this.http.post<PaymentDTO>(`${this.apiUrl}/payments/`, {orderId});
  }

}
