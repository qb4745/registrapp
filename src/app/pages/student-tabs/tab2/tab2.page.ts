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
  qrCode: string  = "329be335-ae72-4eea-b25b-6f85d5aea90d";
  asistencia: any;
  public asistenciaResponse$: Observable<any>;

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

    this.userId = this.authService.getCurrentUserId();

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
    this.router.navigate(['student', 'tabs', 'tab2']);
  }

  async checkAsistencia() {
    this.asistenciaCreated = await firstValueFrom(this.asistenciaService.checkIfAsistenciaIsAlreadyCreated(this.asistenciaId, this.userId));
  }

  async crearAsistenciaByButtonClick(asistenciaId: string, userId: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    const asistenciaCreated = await firstValueFrom(this.asistenciaService.checkIfAsistenciaIsAlreadyCreated(asistenciaId, userId));

    await loading.dismiss();

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
              this.asistenciaResponse$ = this.asistenciaService.createAsistencia(asistenciaId, userId)
                .pipe(takeUntil(this.unsubscribe$));

              this.asistenciaResponse$.subscribe({
                next: (response) => {
                  console.log('Asistencia created successfully:', response);
                  this.showSuccessMessage('Asistencia registrada exitosamente');
                },
                error: (error) => {
                  console.error('Error creating asistencia:', error);
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


    if (asistenciaCreated) {
      this.asistenciaResponse$ = this.asistenciaService.deleteAsistencia(asistenciaId, userId)
        .pipe(takeUntil(this.unsubscribe$));

      this.asistenciaResponse$.subscribe({
        next: (response) => {
        },
        error: (error) => {
          console.error('Error Eliminando asistencia:', error);
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