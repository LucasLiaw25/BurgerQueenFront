import { Component } from '@angular/core';
import { Header } from '../../../components/logged/header/header';
import { Footer } from '../../../components/logged/footer/footer';
import { FirstOrder } from '../../../components/logged/first-order/first-order';

@Component({
  selector: 'app-about',
  imports: [
    Header,
    Footer,
    FirstOrder
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}
