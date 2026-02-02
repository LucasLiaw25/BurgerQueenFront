import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/logged/header/header';
import { Footer } from './components/logged/footer/footer';
import { SideCartComponent } from './components/logged/side-cart-component/side-cart-component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SideCartComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('burger-queen');
}
