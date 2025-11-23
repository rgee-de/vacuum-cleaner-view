import {Component, inject, signal} from '@angular/core';
import {CleaningModesStoreService} from '../../services/cleaning-modes-store.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';

import {CommandsService} from '../../services/commands.service';

@Component({
  selector: 'app-preset-selector',
  imports: [
    Button,
    Dialog
  ],
  templateUrl: './preset-selector.component.html',
  styleUrl: './preset-selector.component.css'
})
export class PresetSelectorComponent {
  visible = signal(false)

  protected readonly cleaningModeStore = inject(CleaningModesStoreService);
  protected readonly commands = inject(CommandsService);

  open(): void {
    this.visible.set(true);
  }

  select(presetName: string): void {
    this.cleaningModeStore.setPreset(presetName);
    this.commands.setMode().subscribe();
    this.visible.set(false);
  }
}
