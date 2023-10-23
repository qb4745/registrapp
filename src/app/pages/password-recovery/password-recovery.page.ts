import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule,]
})
export class PasswordRecoveryPage  {
  credentials = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  currentUrl = window.location.href;

  // Parse the URL to get its parameters
  urlParams = new URLSearchParams(new URL(this.currentUrl).search);

  // Get the token parameter
  token = this.urlParams.get("token");



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}


  get password() {
    return this.credentials.controls.password;
  }

  async updatePassword() {
    console.log('token: ', this.token);
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.updatePassword(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();
      console.log('data: ', data);

      if (data.error) {
        this.showAlert('Cambio de fallido', data.error.message);
      } else {
        this.showAlert("Cambio exitoso", "La contraseña ha sido actualizada, podras ingresarla la proxima vez que se te solicite");
        this.navCtrl.navigateBack('');
      }
    });
  }

  async showAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}