import {Component, inject, signal} from '@angular/core';
import {RepeatStoreService} from '../../services/repeat-store.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';


@Component({
  selector: 'app-repetitions-selector',
  imports: [
    Button,
    Dialog
  ],
  templateUrl: './repetitions-selector.component.html'
})
export class RepetitionsSelectorComponent {
  visible = signal(false)

  protected readonly repeatStore = inject(RepeatStoreService);

  open(): void {
    this.visible.set(true);
  }

  select(rep: number): void {
    this.repeatStore.setRepetition(rep);
    this.visible.set(false);
  }
}
