import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { Product } from '../../../models/food.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FoodService } from '../../../services/food.service';
import { Header } from '../../../components/logged/header/header';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';
import { CommonModule } from '@angular/common';
import { ProductCard } from '../../../components/logged/product-card/product-card';

@Component({
  selector: 'app-search-product',
  imports: [
    Header,
    ProductCard,
    FirstOrder,
    Footer,
    CommonModule,
    RouterLink
  ],
  templateUrl: './search-product.html',
  styleUrl: './search-product.css',
})
export class SearchProduct implements OnInit {
  results: Product[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['name'] || '';
      if (this.searchTerm) {
        this.performSearch(this.searchTerm);
      } else {
        this.results = [];
        this.loading = false;
      }
    });
  }

  performSearch(name: string): void {
    this.loading = true;
    this.results = []; 

    this.foodService.searchMovie({ name: name }).subscribe({
      next: (data) => {
        this.zone.run(() => {
          this.results = data;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('Erro na busca', err);
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }
}