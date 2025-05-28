import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {RoomStoreService} from './services/room-store.service';
import {NgForOf, NgIf} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {CommandsService} from './services/commands.service';
import {RoomModel} from './models/room.model';

@Component({
  selector: 'app-root',
  imports: [NgForOf, ButtonModule, NgIf, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vacuum-cleaner-view';

  private readonly roomStore = inject(RoomStoreService);
  readonly rooms = this.roomStore.rooms;
  private readonly commandsService = inject(CommandsService);

  stop() {
    this.commandsService.stop().subscribe()
  }

  pause() {
    this.commandsService.pause().subscribe()
  }

  charge() {
    this.commandsService.gotoChargePoint().subscribe()
  }

  service() {
    this.commandsService.gotoMaintenancePoint().subscribe()
  }

  clean(room: RoomModel) {
    this.commandsService.cleanSegmentsCustom([room.segment_id]).subscribe()
  }
}
