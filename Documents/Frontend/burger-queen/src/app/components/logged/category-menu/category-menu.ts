import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from '../../../models/food.model';
import { FoodService } from '../../../services/food.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-menu',
  imports: [CommonModule],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.css',
})
export class CategoryMenu implements OnInit {
categories: Category[] = [];
  activeCategory: number = 0; // Começar com 0 (All) é mais seguro para o carregamento inicial

  @Output() categoryChanged = new EventEmitter<number>();

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.foodService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        // Opcional: Se quiser forçar uma categoria específica após carregar:
        // this.selectCategory(0); 
      },
      error: (err) => console.error('Erro ao carregar categorias no menu:', err)
    });
  }

  selectCategory(categoryId: number) {
    this.activeCategory = categoryId;
    this.categoryChanged.emit(categoryId);
  }
}