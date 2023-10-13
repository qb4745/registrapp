import { Component, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';

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
  public userFromPublic: any;
  private userId: string;
  qrCode: string = "84661927-b513-46d1-9216-d3f40ba17dad";
  asistencia: any;

  constructor(private alertController: AlertController, private router: Router, private authService: AuthService,
              private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
    this.userId = this.authService.getCurrentUserId();
    console.log('studiante ngOnInit :', this.userId);

    this.getUserAsistenciaFromObservable(this.qrCode);


  }



  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.qrCode = barcodes[0].displayValue;
    this.barcodes.push(...barcodes);
    this.getUserAsistenciaFromObservable(this.qrCode);

  }

  getUserAsistenciaFromObservable(qrCode: string) {
    if (qrCode.length !== 36) {
      console.log('QR code invalido');
      return;
    }
    this.asistenciaService.getUserAsistenciaDetails(qrCode).subscribe({
      next: (userData) => {
        console.log('getUserAsistenciaFromObservable:', userData);
        this.asistencia = userData[0]; // Assign the received data to your class property
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
      complete: () => {
        console.log('Observable completed');
      }
    });
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