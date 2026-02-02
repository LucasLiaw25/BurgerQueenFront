import { Component, Input } from '@angular/core';
import { Product } from '../../../models/food.model';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
}
