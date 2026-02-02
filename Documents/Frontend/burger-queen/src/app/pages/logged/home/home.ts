import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../../models/food.model';
import { FoodService } from '../../../services/food.service';
import { Header } from '../../../components/logged/header/header';
import { Hero } from '../../../components/logged/hero/hero';
import { Footer } from '../../../components/logged/footer/footer';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../components/logged/product-card/product-card';
import { CategoryMenu } from '../../../components/logged/category-menu/category-menu';
import { FirstOrder } from '../../../components/logged/first-order/first-order';

@Component({
  selector: 'app-home',
  imports: [
    Header,
    Hero,
    CategoryMenu,
    Footer,
    CommonModule,
    ProductCard,
    FirstOrder
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})

export class Home implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  constructor(private foodService: FoodService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.foodService.getProducts().subscribe(data => {
      console.log('API products response (home):', data);
      this.products = data.slice(0, 8);
      this.filteredProducts = data.slice(0, 4);
      this.cdr.detectChanges();
    });
    
  }

  onCategoryChange(categoryId: number) {
  if (categoryId === 0) {
    this.filteredProducts = this.products;
  } else {
    this.foodService.getProductsByCategory(categoryId).subscribe({
      next: (data) => {
        this.filteredProducts = data.slice(0, 4);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao filtrar categoria:', err)
    });
  }
}
}

