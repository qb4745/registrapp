import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Clase } from 'src/app/interfaces/clase.interface';
import { firstValueFrom } from 'rxjs';
import { ClasesService } from 'src/app/services/clases.service';

interface ClaseData {
  claseInfo: any;
}
@Component({
  selector: 'app-clase-detalles',
  templateUrl: './clase-detalles.page.html',
  styleUrls: ['./clase-detalles.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ClaseDetallesPage implements OnInit {

  claseInfoReceived: Clase;

  content_loaded: boolean = false;

  alumnosPorClase: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clasesService: ClasesService
    ) { }

  async ngOnInit() {

    try {
      this.claseInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['clase'];
      console.log('this.claseInfoReceived :', this.claseInfoReceived);
      this.alumnosPorClase = await firstValueFrom(this.clasesService.getgetAlumnosBySeccion(this.claseInfoReceived.seccion_id));
      console.log('this.alumnosPorClase :', this.alumnosPorClase);
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

}
