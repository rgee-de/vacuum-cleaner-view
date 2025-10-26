import {Component, inject} from '@angular/core';
import {RoomStoreService} from './services/room-store.service';
import {NgForOf, NgIf} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {CommandsService} from './services/commands.service';
import {RoomModel} from './models/room.model';
import {SelectedRoomStoreService} from './services/selected-room-store.service';

@Component({
  selector: 'app-root',
  imports: [NgForOf, ButtonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vacuum-cleaner-view';
  protected readonly selectedRoomStore = inject(SelectedRoomStoreService);
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

  clean() {
    const segmentIds = this.selectedRoomStore.selectedIds();
    this.commandsService.cleanSegmentsCustom(segmentIds).subscribe();
    this.selectedRoomStore.clear();
  }

  select(room: RoomModel) {
    this.selectedRoomStore.toggle(room.segment_id);
  }
}
