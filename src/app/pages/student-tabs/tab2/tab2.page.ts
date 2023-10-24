import { Component, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Observable, Subject, firstValueFrom, lastValueFrom, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule,
    FormsModule]
})
export class Tab2Page implements OnInit, OnDestroy{
  public isSupported = false;
  public isPermissionGranted = false;
  public asistenciaCreated = false;

  public formGroup = new UntypedFormGroup({
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  barcodes: Barcode[] = [];
  public userFromPublic: any;
  public userId: string;
  private asistenciaId: string;
  // qrCode: string = "1";
  qrCode: string  = "a6cb4b51-c853-46c9-aa6c-9e0c19627269";
  asistencia: any;
  public asistenciaResponse$: Observable<any>;
  // Create a subject to manage the subscription lifecycle
  private unsubscribe$: Subject<void> = new Subject<void>();

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





  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private authService: AuthService,
    private asistenciaService: AsistenciaService,
    private readonly ngZone: NgZone,
    ) {}

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
      console.log('QR code no pertenece a ninguna asistencia.');
      return;
    }
    this.asistenciaService.getUserAsistenciaNestedJoinsDetails(qrCode).subscribe({
      next: (userData) => {
        console.log('getUserAsistenciaFromObservable:', userData[0]);
        this.asistencia = userData[0];
        this.asistenciaId = userData[0].id;
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

  async checkAsistencia() {
    this.asistenciaCreated = await firstValueFrom(this.asistenciaService.checkIfAsistenciaIsAlreadyCreated(this.asistenciaId, this.userId));
    console.log(' checkAsistencia asistenciaCreated:', this.asistenciaCreated);
  }

  async crearAsistenciaByButtonClick(asistenciaId: string, userId: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    const asistenciaCreated = await firstValueFrom(this.asistenciaService.checkIfAsistenciaIsAlreadyCreated(asistenciaId, userId));
    console.log(' const checkAsistencia asistenciaCreated:', asistenciaCreated);
    console.log(' const asistenciaId:', asistenciaId, 'alumnoId:', userId);

    await loading.dismiss(); // Dismiss the loading spinner

    if (!asistenciaCreated) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estás seguro de crear esta asistencia?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Asistencia creation canceled');
            }
          },
          {
            text: 'Aceptar',
            handler: async () => {
              // Perform the creation of asistencia
              this.asistenciaResponse$ = this.asistenciaService.createAsistencia(asistenciaId, userId)
                .pipe(takeUntil(this.unsubscribe$));

              this.asistenciaResponse$.subscribe({
                next: (response) => {
                  console.log('Asistencia created successfully:', response);
                  // Show success message
                  this.showSuccessMessage('Asistencia registrada exitosamente');
                },
                error: (error) => {
                  console.error('Error creating asistencia:', error);
                  // Handle the error, show error message, etc.
                },
                complete: () => console.log('createAsistencia completed'),
              });
            }
          }
        ]
      });

      await alert.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Aviso',
        message: '¡Asistencia previamente registrada!',
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  async deleteAsistenciaByButtonClick(asistenciaId: string, userId: string) {

    const asistenciaCreated = await firstValueFrom(this.asistenciaService.checkIfAsistenciaIsAlreadyCreated(asistenciaId, userId));
    console.log(' cdeleteAsistenciaByButtonClick asistenciaCreated:', asistenciaCreated);


    if (asistenciaCreated) {
      this.asistenciaResponse$ = this.asistenciaService.deleteAsistencia(asistenciaId, userId)
        .pipe(takeUntil(this.unsubscribe$));

      this.asistenciaResponse$.subscribe({
        next: (response) => {
          console.log('Asistencia Eliminada successfully:', response);
          // Show success message
        },
        error: (error) => {
          console.error('Error Eliminando asistencia:', error);
          // Handle the error, show error message, etc.
        },
        complete: () => console.log('Asistencia Eliminada completed'),
      });
    }
  }

  async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }






}