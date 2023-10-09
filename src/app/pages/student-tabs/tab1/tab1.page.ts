import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { UserModel } from 'src/app/models/UserModel';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as JsBarcode from 'jsbarcode';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActionSheetController, AnimationController, IonModal, IonicModule, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CarreraModel } from 'src/app/models/CarreraModel';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent, FormsModule],
})
export class Tab1Page implements OnInit{
  public userFromPublic: UserModel;
  public nombreCarrera: CarreraModel;
  private userId: string;
  barCodeString = '12345566765';

  barcodeDataURL: string;

  editProfileForm: FormGroup;
  submitAttempt = false;
  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;
  content_visibility = '';



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


    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private navController: NavController,
    private actionSheetController: ActionSheetController


  ) {

    this.authService.getCurrentUser().subscribe(async (user) => {
      if (user) {
        const userId = this.authService.getCurrentUserId();
        console.log('studiante constructor :', userId);


      }
    });
  }



  redirectBasedOnRolValue(userModel: UserModel) {
    if (userModel.rol === 1) {
      console.log('en redirect:');
      this.goToStudentTabs();
    } else if (userModel.rol === 2) {
      this.goToTeacherTabs();
    }
  }

  goToStudentTabs() {
    this.router.navigate(['student/tabs/tab1']);
  }

  goToTeacherTabs() {
    this.router.navigate(['teacher/tabs/tab1']);
  }
  goToLogin() {
    this.router.navigate(['']);
  }

  gotoCredencialVirtual() {
    this.router.navigate(['credencial']);
  }
  gotoCredencialVirtual2() {
    this.router.navigate(['student/tabs/tab1/credencial']);
  }

  signOut() {
    this.authService.signOut();
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

  ngOnInit(): void {

     // Setup form
     this.editProfileForm = this.formBuilder.group({
      name_first: ['', Validators.required],
      name_last: ['', Validators.required]
    });




  }
}
