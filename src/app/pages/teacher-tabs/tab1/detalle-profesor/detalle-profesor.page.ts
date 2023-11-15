import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { ClasesService } from 'src/app/services/clases.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-detalle-profesor',
  templateUrl: './detalle-profesor.page.html',
  styleUrls: ['./detalle-profesor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetalleProfesorPage implements OnInit {

  userInfoReceived: any;

  content_loaded: boolean = false;

  alumnosPorClase: any;

  asistenciaByClase: any;

  editProfileForm: FormGroup;
  submitAttempt = false;
  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;
  content_visibility = '';




  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private clasesService: ClasesService,
    private asistenciaService: AsistenciaService,

    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private actionSheetController: ActionSheetController

    ) {

     }

  async ngOnInit() {

    try {
      this.userInfoReceived = this.router.getCurrentNavigation()?.extras.state?.['user'];
      console.log('userInfoReceived profesor: ', this.userInfoReceived);
      this.content_loaded = true;



     /*  this.alumnosPorClase = await firstValueFrom(this.clasesService.getgetAlumnosBySeccion(this.claseInfoReceived.seccion_id));
      this.alumnosPorClase.sort((a, b) => a.alumnos.apellido_paterno.charAt(0).localeCompare(b.alumnos.apellido_paterno.charAt(0)));

      this.asistenciaByClase = await firstValueFrom(this.asistenciaService.getAsistenciaByClaseId(this.claseInfoReceived.id)); */


      this.content_loaded = true;


    } catch (error) {
      console.error('Error Trayendo los datos de la clases:', error);
    }


  }

  goToStudentTabs() {
    this.router.navigate(['student', 'tabs', 'tab1']);
  }

  goToTeacherTabs() {
    this.router.navigate(['teacher', 'tabs', 'tab1']);
  }

  goToClasesTab() {
    this.router.navigate(['teacher', 'tabs', 'tab2']);
  }

  countTotalAlumnos(index: number): number {
    return index + 1;
  }

  goToCamera() {
    this.router.navigate(['camera']);
  }




  // Update profile picture
  async updateProfilePicture() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Elejir fotografía existente o tomar una nueva',
      cssClass: 'custom-action-sheet',
      buttons: [
        {
          text: 'Elejir fotografía desde galeria',
          icon: 'images',
          handler: () => {
            // falta logica ...
          }
        },
        {
          text: 'Tomar fotografía',
          icon: 'camera',
          handler: () => {
            // falta logica ...
            this.goToCamera();
          }
        }, {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  // Submit form
  submit() {

    this.submitAttempt = true;

    // If form valid
    if (this.editProfileForm.valid) {

      // Save form ...

      // Display success message and go back
      this.toastService.presentToast('Success', 'Profile saved', 'top', 'success', 2000);
      this.navController.back();

    } else {

      // Display error message
      this.toastService.presentToast('Error', 'Please fill in all required fields', 'top', 'danger', 2000);
    }
  }

}
