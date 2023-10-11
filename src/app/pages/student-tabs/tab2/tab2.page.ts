import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule,
    FormsModule]
})
export class Tab2Page implements OnInit{
  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController: AlertController, private router: Router) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.goToStudentTabs2();
    this.barcodes.push(...barcodes);

  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToStudentTabs2() {
    this.router.navigate(['student/tabs/tab2']);
  }
}