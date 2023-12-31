import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { HttpClientModule } from '@angular/common/http';
import { AlumnoService } from 'src/app/services/alumno.service';
import { ProfesorService } from 'src/app/services/profesor.service';
import { firstValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule]
})
export class LoginPage implements OnInit {
  private supabase: SupabaseClient;
  private userFromPublicSchema: any;
  private userId: string;
  private alumnoExiste: Boolean;
  private currentUser: boolean | User | null = null;
  private rol: number = 2;

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
    private alumnoService: AlumnoService,
    private profesorService: ProfesorService
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.authService.getCurrentUser().subscribe(async (user) => {
      if (user && this.authService.initialized === false) {
        this.userId = this.authService.getCurrentUserId();
        console.log('userId ngoninit: ', this.userId);
        this.alumnoExiste = await firstValueFrom(this.alumnoService.checkIfAlumnoExist(this.userId));

        this.redirectByValue(this.alumnoExiste ? true : false); // si alumno existe lleva a seccion estudiantes, sino a profesores
      }
    });

    this.credentials.get('email').setValue('jor.gomezv@profesor.duoc.cl');
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

  redirectByValue(alumnoExiste: Boolean) {
    if (alumnoExiste) {
      this.goToStudentTabs();

    } else {
      this.goToTeacherTabs();
    }
    this.authService.setInizializedToTrue();

  }

  redirectByRolValue(numberRol: number | undefined) {
    if (numberRol === 1) {
      this.goToStudentTabs();
    } else if (numberRol === 2)  {
      this.goToTeacherTabs();
    }
    this.authService.setInizializedToTrue();

  }


  goToStudentTabs() {
    if (this.authService.initialized) return;
    this.router.navigate(['student', 'tabs', 'tab1']);
  }

  goToTeacherTabs() {
    this.router.navigate(['teacher', 'tabs', 'tab1']);
  }

  goToRegister() {
    this.router.navigate(['register']);
  }











}


