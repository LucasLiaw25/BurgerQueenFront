import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Header } from '../../../components/logged/header/header';
import { Footer } from '../../../components/logged/footer/footer';
import { Product } from '../../../models/food.model';
import { FoodService } from '../../../services/food.service';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { OrderItemRequest, OrderRequest } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, Header, Footer, RouterModule, FirstOrder],
  templateUrl: './product-detail-component.html',
  styleUrls: ['./product-detail-component.css']
})
export class ProductDetailComponent implements OnInit {
  product?: Product;
  quantity: number = 1;
  loadingOrder: boolean = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.foodService.getProductByIdOrThrow(id).subscribe({
        next: (data) => {
          this.product = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }
  }

  updateQuantity(val: number) {
    if (this.quantity + val >= 1) {
      this.quantity += val;
    }
  }

  createOrder() {
    if (!this.product || this.loadingOrder) return;

    this.loadingOrder = true;
    this.successMessage = '';
    this.errorMessage = '';

    const item: OrderItemRequest = {
      productId: this.product.id,
      quantity: this.quantity
    };

    const request: OrderRequest = {
      items: [item],
      couponCode: []
    };

    this.foodService.createOrder(request).subscribe({
      next: (order) => {
        this.zone.run(() => {
          this.loadingOrder = false;
          this.successMessage = "Adicionado ao carrinho!";
          this.orderService.refreshCartCount();
          this.cdr.detectChanges();
          
          setTimeout(() => { this.successMessage = ''; this.cdr.detectChanges(); }, 5000);
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loadingOrder = false;
          this.errorMessage = err.error?.message || 'Erro ao processar seu pedido.';
          this.cdr.detectChanges();
        });
      }
    });
  }
}