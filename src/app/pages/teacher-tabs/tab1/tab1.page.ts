import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProfesorService } from 'src/app/services/profesor.service';
import { ActionSheetController, AnimationController, IonModal, NavController } from '@ionic/angular';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class Tab1Page implements OnInit {

  content_loaded: boolean = false;

  profesorId: string;

  userFromPublic: any;

  submitAttempt = false;
  editProfileForm: FormGroup;

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


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private profesorService: ProfesorService,

    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private actionSheetController: ActionSheetController
  ) {

  }

  async ngOnInit() {


    try {
      this.profesorId = this.authService.getCurrentUserId();
      this.userFromPublic = await firstValueFrom(this.profesorService.getProfesorInfo(this.profesorId));
      this.content_loaded = true;


    } catch (error) {
      console.error('Error Trayendo los datos de las clases:', error);
    }
  }




  goToStudentTabs() {
    if (this.authService.initialized) return;
    this.router.navigate(['student', 'tabs', 'tab1']);
  }

  goToTeacherTabs() {
    this.router.navigate(['teacher', 'tabs', 'tab1']);
  }


  signOut() {
    this.authService.signOut();
    this.authService.setInizializedToFalse();
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
