import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonRouterOutlet, IonicModule, ModalController, ModalOptions,} from '@ionic/angular';
import { FilterPage } from './filter/filter.page';
import { CommonModule } from '@angular/common';
import { ClasesService } from 'src/app/services/clases.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FilterPage]
})
export class Tab2Page implements OnInit {

  private profesorId: string;

  content_loaded: boolean = false;

  constructor(
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController,
    private clasesService: ClasesService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    // Fake timeout
    setTimeout(() => {
      this.content_loaded = true;
    }, 1000);
    this.profesorId = this.authService.getCurrentUserId();
    console.log('profesor tab 2ngOnInit :', this.profesorId);
    this.clasesService.getProfesorClasesList(this.profesorId).subscribe((data) => {
      console.log('data tab 2 :', data);
    });

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

}
