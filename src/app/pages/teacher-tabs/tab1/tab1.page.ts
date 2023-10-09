import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { UserModel } from 'src/app/models/UserModel';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent],
})
export class Tab1Page {
  public userFromPublic: UserModel;


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,


  ) {
    this.authService.getCurrentUser().subscribe(async (user) => {
      if (user) {
        const userId = this.authService.getCurrentUserId();
        console.log('USER ID:', userId);
        if (this.userFromPublic !== undefined) {
          console.log('USER FROM PUBLIC2:', this.userFromPublic);
          this.redirectBasedOnRolValue(this.userFromPublic);
        }

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
}
