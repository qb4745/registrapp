import { IonModal, IonicModule } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Clase } from 'src/app/interfaces/clase.interface';
import { firstValueFrom } from 'rxjs';
import { ClasesService } from 'src/app/services/clases.service';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { IonRouterOutlet, ModalController, ModalOptions, ViewWillEnter,} from '@ionic/angular';
import { FilterPage } from '../../teacher-tabs/tab2/filter/filter.page';
import * as moment from 'moment-timezone';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class Tab3Page implements OnInit {

  private supabase: SupabaseClient;

  claseInfoReceived: Clase;

  content_loaded: boolean = false;

  alumnosPorClase: any;

  asistenciaByClase: any;

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

  seccionesDeAlumno: Number[];
  seccionIds: any;
  alumnoId: string;

  clasesList: Clase[];
  clasesListFilteredByAlumnoSecciones: Clase[];


  date = moment().tz('America/Santiago').format('YYYY-MM-DD');
  currentDate = this.date;

  private profesorId: string;



  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clasesService: ClasesService,
    private asistenciaService: AsistenciaService,
    private authService: AuthService,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,

    ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

     }

  async ngOnInit() {
    this.alumnoId = this.authService.getCurrentUserId();
    this.seccionesDeAlumno = (await this.supabase.rpc('getseccionesalumnos', { palumno_id: this.alumnoId })).data.map(item => item.seccion_id);
    console.log('this.seccionesDeAlumno :', this.seccionesDeAlumno);


    try {
      console.log('currentDate:', this.currentDate);
      // this.clasesList = await firstValueFrom(this.clasesService.getProfesorClasesListCurrentDay(this.alumnoId, this.currentDate));
      this.clasesList = await firstValueFrom(this.clasesService.getClasesAndSeccionbyFecha(this.currentDate));
      console.log('this.clasesList :', this.clasesList);

      this.clasesListFilteredByAlumnoSecciones = this.clasesList.filter(clase => this.seccionesDeAlumno.includes(clase.seccion_id));
      console.log('this.clasesListFilteredByAlumnoSecciones :', this.clasesListFilteredByAlumnoSecciones);

      this.clasesList.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      this.content_loaded = true;
      console.log('clasesList tab 2 :', this.clasesList);
    } catch (error) {
      console.error('Error Trayendo los datos de las clases:', error);
    }


  }

  goToClasesTab() {
    this.router.navigate(['teacher', 'tabs', 'tab2']);
  }

  countTotalAlumnos(index: number): number {
    return index + 1;
  }

    // Filter
    async filter() {

      // Open filter modal
      const modal = await this.modalController.create({
        component: FilterPage,
        presentingElement: this.routerOutlet.nativeEl
      });

      await modal.present();

      // Apply filter from modal
      const { data } = await modal.onWillDismiss();

      if (data) {

        // Reload
        this.content_loaded = false;

        // Fake timeout
        setTimeout(() => {
          this.content_loaded = true;
        }, 2000);
      }
    }

    getCurrentDate(): string {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const locale = 'es-CL';
      const currentDate = new Date();
      return currentDate.toLocaleDateString(locale, options);
    }

    goToClaseDetails(claseInfo: Clase) {
      let claseInfoSend: NavigationExtras = {
        state: {
          clase: claseInfo

        }
      }
      console.log('claseInfo:', claseInfoSend);
      const id = claseInfo.id;
      this.router.navigate([`clase-detalles/${id}`], claseInfoSend);
    }

}