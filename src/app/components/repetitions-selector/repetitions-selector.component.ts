import {Component, signal} from '@angular/core';
import {RepeatStoreService} from '../../services/repeat-store.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-repetitions-selector',
  imports: [
    Button,
    Dialog,
    NgForOf
  ],
  templateUrl: './repetitions-selector.component.html',
  styleUrl: './repetitions-selector.component.css'
})
export class RepetitionsSelectorComponent {
  visible = signal(false)

  constructor(protected repeatStore: RepeatStoreService) {
  }

  open(): void {
    this.visible.set(true);
  }

  select(rep: number): void {
    this.repeatStore.setRepetition(rep);
    this.visible.set(false);
  }
}
