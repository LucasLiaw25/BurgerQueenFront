import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Product } from '../../../models/food.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';
import { Header } from '../../../components/logged/header/header';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CouponRequest, CouponResponse } from '../../../models/coupon.model';

@Component({
  selector: 'app-produt-coupon',
  imports: [CommonModule, CurrencyPipe, Header, Footer, RouterModule, FirstOrder],
  templateUrl: './produt-coupon.html',
  styleUrl: './produt-coupon.css',
})
export class ProductCoupon implements OnInit {
  product?: any;
  loading = false;
  successMessage = '';
  errorMessage = '';
  copySuccess = false;
  generatedCoupon: CouponResponse | null = null;
  readonly DISCOUNT_FACTOR = 0.25;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.foodService.getProductByIdOrThrow(id).subscribe({
        next: (data) => {
          this.product = {
            ...data,
            discountedPrice: data.price * (1 - this.DISCOUNT_FACTOR)
          };
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao carregar produto para cupom', err)
      });
    }
    this.cdr.detectChanges();
  }

  claimCoupon(): void {
    if (!this.product || this.loading) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const request: CouponRequest = { productId: this.product.id };

    this.foodService.createCoupon(request).subscribe({
      next: (response: CouponResponse) => {
        this.zone.run(() => {
          this.generatedCoupon = response;
          this.successMessage = "Cupom gerado com sucesso!";
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          this.loading = false;
          this.errorMessage = err.error?.message || "Não foi possível gerar o cupom no momento.";
          this.cdr.detectChanges();
          setTimeout(() => {
            this.errorMessage = '';
            this.cdr.detectChanges();
          }, 5000);
        });
      }
    });
  }
  copyToClipboard(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.zone.run(() => {
        this.copySuccess = true;
        this.cdr.detectChanges();

        // Volta o ícone ao normal após 2 segundos
        setTimeout(() => {
          this.copySuccess = false;
          this.cdr.detectChanges();
        }, 2000);
      });
    });
  }

}