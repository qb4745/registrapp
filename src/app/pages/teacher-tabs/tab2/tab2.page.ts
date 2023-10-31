import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonRouterOutlet, IonicModule, ModalController, ModalOptions, ViewWillEnter,} from '@ionic/angular';
import { FilterPage } from './filter/filter.page';
import { CommonModule } from '@angular/common';
import { ClasesService } from 'src/app/services/clases.service';
import { AuthService } from 'src/app/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Clase } from 'src/app/interfaces/clase.interface';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FilterPage]
})
export class Tab2Page implements OnInit, ViewWillEnter {

  private profesorId: string;
  // clasesList: any;
  clasesList: Clase[];
  // claseInfo: Clase;

  // currentDate = new Date();

  // currentDate = new Date('2023-11-15').toISOString().slice(0, 10);

  date = moment().tz('America/Santiago').format('YYYY-MM-DD');
  currentDate = this.date;

  content_loaded: boolean = false;

  constructor(
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private clasesService: ClasesService,
    private authService: AuthService,
    private router: Router,

  ) { }

  async ngOnInit() {

    this.profesorId = this.authService.getCurrentUserId();

    try {
      this.clasesList = await firstValueFrom(this.clasesService.getProfesorClasesListCurrentDay(this.profesorId, this.currentDate));
      this.clasesList.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
      this.content_loaded = true;

    } catch (error) {
      console.error('Error Trayendo los datos de las clases:', error);
    }
  }

  async ionViewWillEnter(){

  }

  async ionViewDidEnter(){

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
    const id = claseInfo.id;
    this.router.navigate([`clase-detalles/${id}`], claseInfoSend);
  }

}
