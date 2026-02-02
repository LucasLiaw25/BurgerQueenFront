import { ChangeDetectorRef, Component, NgZone, OnInit, signal } from '@angular/core';
import { ProductResponse } from '../../../models/food.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { OrderService } from '../../../services/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { OrderItemRequest, OrderRequest } from '../../../models/order.model';
import { Header } from '../../../components/logged/header/header';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';

@Component({
  selector: 'app-coupon.product.component',
  imports: [
    CurrencyPipe,
    CommonModule,
    Header,
    FirstOrder,
    Footer,
    RouterLink
  ],
  templateUrl: './coupon.product.component.html',
  styleUrl: './coupon.product.component.css',
})
export class CouponProductComponent implements OnInit {
  product = signal<ProductResponse | null>(null);
  couponCode = "";
  loadingOrder = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private orderService: OrderService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Pegamos o código da URL para aplicar no momento da compra
    this.couponCode = this.route.snapshot.paramMap.get('code') || "";

    if (id) {
      this.foodService.getProductByIdOrThrow(Number(id)).subscribe({
        next: (prod) => {
          this.product.set(prod);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorMessage = "Produto da oferta não encontrado.";
        }
      });
    }
  }

  adicionarAoCarrinho() {
    const currentProduct = this.product();
    
    if (!currentProduct || !currentProduct.id || this.loadingOrder) return;

    this.loadingOrder = true;
    this.successMessage = '';
    this.errorMessage = '';

    const item: OrderItemRequest = {
      productId: currentProduct.id,
      quantity: 1 
    };

    const request: OrderRequest = {
      items: [item],
      couponCode: [this.couponCode] 
    };

    this.foodService.createOrder(request).subscribe({
      next: (order) => {
        this.zone.run(() => {
          this.loadingOrder = false;
          this.successMessage = "Oferta resgatada! Produto no carrinho.";
          this.orderService.refreshCartCount();
          this.cdr.detectChanges();
          
          setTimeout(() => { 
            this.successMessage = ''; 
            this.cdr.detectChanges(); 
          }, 5000);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loadingOrder = false;
          this.errorMessage = err.error?.message || 'Este cupom não pode mais ser usado.';
          this.cdr.detectChanges();
        });
      }
    });
  }
}