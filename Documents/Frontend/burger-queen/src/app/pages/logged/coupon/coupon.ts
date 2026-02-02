import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Header } from '../../../components/logged/header/header';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';
import { CommonModule } from '@angular/common';
import { FoodService } from '../../../services/food.service';
import { RouterLink } from '@angular/router';
import { CouponProduct } from '../../../models/food.model';

@Component({
  selector: 'app-coupon',
  imports: [
    Header,
    FirstOrder,
    Footer,
    CommonModule,
    RouterLink
  ],
  templateUrl: './coupon.html',
  styleUrl: './coupon.css',
})
export class Coupon implements OnInit {
  groupedCoupons: { categoryName: string, products: CouponProduct[] }[] = [];
  readonly DISCOUNT_FACTOR = 0.25;

  constructor(
    private foodService: FoodService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.foodService.getCategories().subscribe(categories => {
    console.log('📦 CATEGORIES RAW:', categories);
    console.log(
      '📦 CATEGORIES IDS:',
      categories.map(c => ({ id: c.id, type: typeof c.id }))
    );

    this.foodService.getProducts().subscribe(products => {
      console.log('📦 PRODUCTS RAW:', products);
      console.log(
        '📦 PRODUCTS CATEGORY IDS:',
        products.map(p => ({
          productId: p.id,
          categoryId: p.category?.id,
          type: typeof p.category?.id
        }))
      );

      this.groupedCoupons = categories.map(cat => {
        const filtered = products.filter(
          p => Number(p.category?.id) === Number(cat.id)
        );

        console.log(
          `🔎 MATCH Coupon | Category ${cat.name} (${cat.id}) ->`,
          filtered.length,
          'produtos'
        );

        return {
          categoryName: cat.name,
          products: filtered
            .slice(0, 4)
            .map(p => ({
              ...p,
              discountedPrice: p.price * (1 - this.DISCOUNT_FACTOR)
            }))
        };
      }).filter(group => group.products.length > 0);

      console.log('✅ GROUPED COUPONS FINAL:', this.groupedCoupons);
      this.cdr.detectChanges();
    });
  });
}

  generateCoupon(productId: number) {
    console.log('Solicitando cupom para o produto:', productId);
  }
}
