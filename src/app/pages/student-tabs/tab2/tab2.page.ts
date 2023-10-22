import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule,
    FormsModule]
})
export class Tab2Page implements OnInit{
  public isSupported = false;
  public isPermissionGranted = false;

  public formGroup = new UntypedFormGroup({
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  barcodes: Barcode[] = [];
  public userFromPublic: any;
  private userId: string;
  qrCode: string = "1";
  // qrCode: string  = "a6cb4b51-c853-46c9-aa6c-9e0c19627269";
  asistencia: any;

  @ViewChild(IonModal) modal: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }





  constructor(private alertController: AlertController, private router: Router, private authService: AuthService,
              private asistenciaService: AsistenciaService, private readonly ngZone: NgZone) {}

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
/*     BarcodeScanner.removeAllListeners().then(() => {
      BarcodeScanner.addListener(
        'googleBarcodeScannerModuleInstallProgress',
        (event) => {
          this.ngZone.run(() => {
            console.log('googleBarcodeScannerModuleInstallProgress', event);
            const { state, progress } = event;
            this.formGroup.patchValue({
              googleBarcodeScannerModuleInstallState: state,
              googleBarcodeScannerModuleInstallProgress: progress,
            });
          });
        }
      );
    }); */
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
    this.asistenciaService.getUserAsistenciaNestedJoinsDetails(qrCode).subscribe({
      next: (userData) => {
        console.log('getUserAsistenciaFromObservable:', userData[0]);
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

  public async openSettings(): Promise<void> {
    await BarcodeScanner.openSettings();
  }

  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  goToStudentTabs2() {
    this.router.navigate(['student/tabs/tab2']);
  }

  updateAsistioFieldToTrue(qrCode: string): void {
    this.asistenciaService.updateAsistioStatusToTrue(qrCode).subscribe(
      response => {
        console.log('Asistencia actualizada: True');
      },
      error => {
        console.error('Error updating record:', error);
      }
    );
  }
  updateAsistioFieldToFalse(qrCode: string): void {
    this.asistenciaService.updateAsistioStatusToFalse(qrCode).subscribe(
      response => {
        console.log('Asistencia actualizada: False');
      },
      error => {
        console.error('Error updating record:', error);
      }
    );
  }






}