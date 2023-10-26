import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-clase-detalles',
  templateUrl: './clase-detalles.page.html',
  styleUrls: ['./clase-detalles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClaseDetallesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
