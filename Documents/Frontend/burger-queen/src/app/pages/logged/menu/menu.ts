import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../../components/logged/header/header';
import { ProductCard } from '../../../components/logged/product-card/product-card';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';
import { Product } from '../../../models/food.model';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [Header, ProductCard, FirstOrder, Footer, CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  groupedMenu: { categoryName: string, products: Product[] }[] = [];

  constructor(
    private foodService: FoodService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.foodService.getCategories().subscribe(categories => {
    console.log('📦 MENU CATEGORIES RAW:', categories);
    console.log(
      '📦 MENU CATEGORY IDS:',
      categories.map(c => ({ id: c.id, type: typeof c.id }))
    );

    this.foodService.getProducts().subscribe(allProducts => {
      console.log('📦 MENU PRODUCTS RAW:', allProducts);
      console.log(
        '📦 MENU PRODUCTS CATEGORY IDS:',
        allProducts.map(p => ({
          productId: p.id,
          categoryId: p.category?.id,
          type: typeof p.category?.id
        }))
      );

      this.groupedMenu = categories.map(cat => {
        const filtered = allProducts.filter(
          p => Number(p.category?.id) === Number(cat.id)
        );

        console.log(
          `🔎 MATCH Menu | Category ${cat.name} (${cat.id}) ->`,
          filtered.length,
          'produtos'
        );

        return {
          categoryName: cat.name,
          products: filtered
        };
      }).filter(group => group.products.length > 0);

      console.log('✅ GROUPED MENU FINAL:', this.groupedMenu);
      this.cdr.detectChanges();
    });
  });
}

}