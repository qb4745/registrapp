import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  credentials = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('USUARIO OBTENIDO AL INICIAR SESIÓN');
        /* this.router.navigateByUrl('/pages/student-tabs/tabs', { replaceUrl: true }); */
        this.goToStudentTabs();
      }
    });
  }

  get email() {
    return this.credentials.controls.email;
  }

  get password() {
    return this.credentials.controls.password;
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.signIn(this.credentials.getRawValue()).then(async (data) => {
      await loading.dismiss();

      if (data.error) {
        this.showAlert('Inicio de sesión fallido', data.error.message);
      }
    });
  }
  async forgotPw() {
    const alert = await this.alertController.create({
      header: 'Recibir una nueva contraseña',
      message: 'Por favor, ingresa tu correo electrónico',
      inputs: [
        {
          type: 'email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Restablecer contraseña',
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.sendPwReset(result.email);
            await loading.dismiss();

            if (error) {

              this.showAlert('Error', 'Por favor, ingresa tu correo electrónico');
            } else {
              this.showAlert('Éxito', '¡Por favor, revisa tu correo electrónico para obtener más instrucciones!');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async getMagicLink() {
    const alert = await this.alertController.create({
      header: 'Obtener un Enlace Mágico',
      message: '¡Te enviaremos un enlace para iniciar sesión de manera mágica!',
      inputs: [
        {
          type: 'email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Obtener Enlace Mágico',
          handler: async (result) => {
            const loading = await this.loadingController.create();
            await loading.present();
            const { data, error } = await this.authService.signInWithEmail(result.email);
            await loading.dismiss();
            console.log('después de registrarse: ', data);
            console.log('error después de registrarse: ', error);

            if (error) {
              this.showAlert('Error', error.message);
            } else {
              this.showAlert('Éxito', '¡Por favor, revisa tu correo electrónico para obtener más instrucciones!');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async showAlert(title, msg) {
    const alert = await this.alertController.create({
      header: title,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  goToStudentTabs() {
    this.router.navigate(['student/tabs/tab1']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }

  ngOnInit(): void {

  }
}
