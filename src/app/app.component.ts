import { Component, EnvironmentInjector, NgZone, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { App, URLOpenListenerEvent } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
  constructor(private zone: NgZone, private router: Router, private authService: AuthService) {
    this.setupListener()
  }

  setupListener() {
    App.addListener('appUrlOpen', async (data: URLOpenListenerEvent) => {
      console.log('app opened with URL: ', data)

      const openUrl = data.url
      const access = openUrl.split('#access_token=').pop().split('&')[0]
      const refresh = openUrl.split('&refresh_token=').pop().split('&')[0]

      await this.authService.setSession(access, refresh)

      this.zone.run(() => {
        this.router.navigateByUrl('/groups', { replaceUrl: true })
      })
    })
  }
}