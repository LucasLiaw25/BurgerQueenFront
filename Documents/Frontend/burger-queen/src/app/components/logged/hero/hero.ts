import { Component, signal } from '@angular/core';
import { OrderRequest } from '../../../models/order.model';
import { FoodService } from '../../../services/food.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductResponse } from '../../../models/food.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [
    CommonModule,
    FormsModule,

  ],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  couponInput = signal<string>('');
  isProcessing = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  promoProduct = signal<ProductResponse | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(
    private foodService: FoodService,
    private router: Router
  ) {}

  aplicarCupom() {
  const code = this.couponInput().trim();
  if (!code) return;

  this.isProcessing.set(true);
  
  this.foodService.getProductByCoupon(code).subscribe({
    next: (response) => {
      this.successMessage.set("Cupom validado! Redirecionando...");
      
      setTimeout(() => {
        this.isProcessing.set(false);
        this.router.navigate(['/coupon/product', response.product.id, code]);
      }, 1500);
    },
    error: (err) => {
      this.isProcessing.set(false);
      const msg = err.error?.message || "Cupom inválido ou expirado.";
      this.errorMessage.set(msg);
      setTimeout(() => {
        this.errorMessage.set(null);
      }, 2000);
    }
  });
}

  fecharPromo() {
    this.promoProduct.set(null);
  }
}