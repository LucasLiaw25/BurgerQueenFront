import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { OrderDTO } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { FoodService } from '../../../services/food.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-side-cart-component',
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './side-cart-component.html',
  styleUrl: './side-cart-component.css',
})
export class SideCartComponent implements OnInit {
  isVisible = false;
  currentOrder?: OrderDTO;
  isProcessing = signal<boolean>(false);
  showSuccessMessage = signal<boolean>(false);

  constructor(
    private orderService: OrderService, 
    private cdr: ChangeDetectorRef,
    private paymentService: PaymentService  ,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    this.orderService.cartVisible$.subscribe(visible => {
      this.isVisible = visible;
      if (visible) this.loadCartData();
    });
  }

  loadCartData() {
    this.foodService.getCurrentPendingOrder().subscribe(order => {
      this.currentOrder = order;
      this.cdr.detectChanges();
    });
  }

  onRemove(productId: number) {
    this.orderService.removeItem(productId).subscribe({
      next: (updatedOrder) => {
        this.currentOrder = updatedOrder;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Erro ao remover:", err)
    });
  }

  closeCart() {
    this.orderService.toggleCart();
  }

  finalizarPedido() {
  if (this.currentOrder && this.currentOrder.id) {
    this.isProcessing.set(true);

    this.paymentService.createPixPayment(this.currentOrder.id).subscribe({
      next: (payment) => {
        this.showSuccessMessage.set(true); 
        console.log('Pagamento gerado:', payment);
        setTimeout(() => {
          if (payment.link) {
            window.location.href = payment.link;
          }
        }, 2000); 
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.showSuccessMessage.set(false);
        console.error('Erro ao gerar pagamento:', err);
        alert('Erro ao processar o pedido. Tente novamente.');
      }
    });
  }
}
}