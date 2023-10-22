import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { FormsModule } from '@angular/forms';
import { MongobdService } from 'src/app/services/mongobd.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, FormsModule],
})
export class Tab3Page implements OnInit {

  constructor(private mongobdService: MongobdService) {

  }

  ngOnInit() {
    this.mongobdService.getUser().subscribe((data) => {
      console.log("profesores", data);
    });

  }


}

