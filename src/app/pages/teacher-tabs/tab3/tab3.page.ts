import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QRCodeModule } from "angularx-qrcode";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, QRCodeModule, CommonModule, FormsModule],
})
export class Tab3Page  {

}