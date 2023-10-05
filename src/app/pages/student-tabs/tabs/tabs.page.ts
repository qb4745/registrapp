import { Component, EnvironmentInjector, inject } from '@angular/core';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { UserModel } from 'src/app/models/UserModel';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
  ) {}

}
