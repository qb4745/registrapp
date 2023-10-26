import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { UserModel } from 'src/app/models/UserModel';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class Tab1Page {
  public userFromPublic: UserModel;


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,


  ) {

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
    this.authService.setInizializedToFalse();
  }
}
