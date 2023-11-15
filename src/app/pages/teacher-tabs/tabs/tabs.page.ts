import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {}

  ionViewDidEnter() {
    document.querySelector('#tab-button-tab3').shadowRoot.querySelector('.button-native').setAttribute('style', 'margin-top: -2px');
}
}
