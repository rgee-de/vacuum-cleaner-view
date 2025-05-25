import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RoomStoreService} from './services/room-store.service';
import {NgForOf} from '@angular/common';
import {Button, ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgForOf, ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'vacuum-cleaner-view';

  private readonly roomStore = inject(RoomStoreService);
  readonly rooms = this.roomStore.rooms;
}
