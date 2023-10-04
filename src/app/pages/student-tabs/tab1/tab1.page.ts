import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { UserModel } from 'src/app/models/UserModel';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExploreContainerComponent],
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
        this.getUserFromPublicTable(userId);
        this.redirectBasedOnRolValue(this.userFromPublic);
        if (this.userFromPublic !== undefined) {
          console.log('USER FROM PUBLIC2:', this.userFromPublic);
          this.redirectBasedOnRolValue(this.userFromPublic);
        }

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
}
