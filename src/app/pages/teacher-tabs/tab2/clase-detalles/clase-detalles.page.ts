import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Clase } from 'src/app/interfaces/clase.interface';
import { firstValueFrom } from 'rxjs';
import { ClasesService } from 'src/app/services/clases.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { QRCodeModule } from "angularx-qrcode";

interface ClaseData {
  claseInfo: any;
}
@Component({
  selector: 'app-clase-detalles',
  templateUrl: './clase-detalles.page.html',
  styleUrls: ['./clase-detalles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, QRCodeModule]
})
export class ClaseDetallesPage implements OnInit {

  claseInfoReceived: Clase;

  content_loaded: boolean = false;

  alumnosPorClase: any;

  asistenciaByClase: any;

  // modal
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

  title = "RegistrAPP - QR Code Generator";

  public qrdata: string = null;
  public elementType: "img" | "url" | "canvas" | "svg" = null;
  public level: "L" | "M" | "Q" | "H";
  public scale: number;
  public width: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clasesService: ClasesService,
    private asistenciaService: AsistenciaService

    ) {
      this.elementType = "img";
      this.level = "M";
      this.scale = 1;
      this.width = 256;
     }

  async ngOnInit() {

    try {
      this.claseInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['clase'];
      console.log('this.claseInfoReceived :', this.claseInfoReceived);

      this.alumnosPorClase = await firstValueFrom(this.clasesService.getgetAlumnosBySeccion(this.claseInfoReceived.seccion_id));
      this.alumnosPorClase.sort((a, b) => a.alumnos.apellido_paterno.charAt(0).localeCompare(b.alumnos.apellido_paterno.charAt(0)));
      console.log('this.alumnosPorClase :', this.alumnosPorClase);

      this.asistenciaByClase = await firstValueFrom(this.asistenciaService.getAsistenciaByClaseId(this.claseInfoReceived.id));
      console.log('this.asistenciaByClase :', this.asistenciaByClase);

      this.qrdata = this.asistenciaByClase[0].id;
      console.log('this.qrdata :', this.qrdata);

      this.content_loaded = true;


    } catch (error) {
      console.error('Error Trayendo los datos de la clases:', error);
    }


  }

  goToClasesTab() {
    this.router.navigate(['teacher', 'tabs', 'tab2']);
  }

  countTotalAlumnos(index: number): number {
    return index + 1;
  }

  changeElementType(newValue: "img" | "url" | "canvas" | "svg"): void {
    this.elementType = newValue;
  }

  changeLevel(newValue: "L" | "M" | "Q" | "H"): void {
    this.level = newValue;
  }

  changeQrdata(newValue: string): void {
    this.qrdata = newValue;
  }

  changeScale(newValue: number): void {
    this.scale = newValue;
  }

  changeWidth(newValue: number): void {
    this.width = newValue;
  }

}
