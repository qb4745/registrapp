import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NavigationExtras, Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { HttpClientModule } from '@angular/common/http';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class LoginPage implements OnInit {
  private supabase: SupabaseClient;
  private userFromPublicSchema: any;
  private userId: string;

  credentials = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });



  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userId = this.authService.getCurrentUserId();
        console.log('ngonit:', this.userId);
        this.userService.getUserObservable(this.userId).subscribe(
          (user) => {
            // Handle the API response here
            this.userFromPublicSchema = user[0];
            console.log('User student ion will enter:', this.userFromPublicSchema);
            console.log('User student ion will enter ROL:', this.userFromPublicSchema.rol);
            this.redirectByRolValue(this.userFromPublicSchema.rol);
          },
          (error) => {
            // Handle errors here
            console.error('Error fetching user data:', error);
          }
        );

      }
    });
    this.credentials.get('email').setValue('combustion.1@gmail.com');
    this.credentials.get('password').setValue('123456');
  }

  async ionViewWillEnter() {

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

  redirectByRolValue(numberRol: number) {
    if (numberRol === 1) {
      console.log('en redirect:');
      this.goToStudentTabs();
    } else if (numberRol === 2) {
      this.goToTeacherTabs();
    }
  }

  goToStudentTabs() {
    this.router.navigate(['student/tabs/tab1']);
  }

  goToTeacherTabs() {
    this.router.navigate(['teacher/tabs/tab1']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }










}


