import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { SideCartComponent } from '../side-cart-component/side-cart-component';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    CommonModule, 
    RouterModule, 
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit{
  cartCount: number = 0;
  searchQuery: string = '';

  constructor(
    private router: Router,
    private cartService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
      this.cdr.detectChanges();
    });

    this.cartService.refreshCartCount();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { name: this.searchQuery } 
      });
      this.searchQuery = ''; 
    }
    
  }

  openCart(): void {
    this.cartService.toggleCart();
  }

}
