import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { OrderDTO } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { catchError, of } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Header } from '../../../components/logged/header/header';
import { FirstOrder } from '../../../components/logged/first-order/first-order';
import { Footer } from '../../../components/logged/footer/footer';

@Component({
  selector: 'app-user.profile.component',
  imports: [
    CommonModule,
    CurrencyPipe,
    Header,
    FirstOrder,
    Footer
  ],
  templateUrl: './user.profile.component.html',
  styleUrl: './user.profile.component.css',
})
export class UserProfileComponent implements OnInit {
  // Gerenciamento de estado com Signals
  preparingOrder = signal<OrderDTO | null>(null);
  orderHistory = signal<OrderDTO[]>([]);
  userName = signal<string>('Carregando...'); // Inicializado como Signal

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.fetchUserName();
  }

  loadUserData() {
    this.orderService.getPreparingOrder().pipe(
      catchError(error => {
        console.warn('Nenhum pedido em preparo encontrado.');
        return of(null);
      })
    ).subscribe(order => {
      this.preparingOrder.set(order);
      this.cdr.detectChanges();
    });

    this.orderService.getCompletedOrders().pipe(
      catchError(error => {
        console.error('Erro ao carregar histórico:', error);
        return of([]); 
      })
    ).subscribe(history => {
      this.orderHistory.set(history);
      this.cdr.detectChanges();
    });
  }

  fetchUserName() {
    this.orderService.getUserName().subscribe({
      next: (name) => {
        this.userName.set(`Olá, ${name}!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Não foi possível carregar o nome:', err);
        this.userName.set('Olá, Cliente!'); 
      }
    });
  }
}