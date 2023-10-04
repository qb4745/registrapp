import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionSheetController, IonicModule, NavController } from '@ionic/angular';
import * as JsBarcode from 'jsbarcode';
import { UserModel } from 'src/app/models/UserModel';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-credencial-virtual',
  templateUrl: './credencial-virtual.page.html',
  styleUrls: ['./credencial-virtual.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,
    ReactiveFormsModule
  ]
})
export class CredencialVirtualPage implements OnInit {
  public userFromPublic: UserModel;
  barCodeString = '12345566765';

  editProfileForm: FormGroup;
  submitAttempt = false;


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
        this.getUserFromPublicTable(userId);
        console.log('studiante constructor2 :', this.userFromPublic);



      }
    });
  }

  getUserFromPublicTable(userId: string) {
    this.userService.getUserDetailsObservable(userId).subscribe({
      next: user => {
      /*   console.log('User Details:', user); */
        this.userFromPublic = user[0];
    /*     console.log('User From Public:', this.userFromPublic); */
        // Access all fields of the user object like user.rol, user.email, user.id, etc.
      },
      error: error => {
        console.error('Error fetching user details:', error);
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




    JsBarcode("#barcode", this.barCodeString, {
      // format: "pharmacode",
      lineColor: "#0aa",
      width:4,
      height:200,
      displayValue: false
    });
  }
}
