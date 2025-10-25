import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomStoreService {
  private readonly _selectedIds = signal<Set<number>>(new Set())

  readonly selectedIds = computed<number[]>(() => Array.from(this._selectedIds()).sort((a,b) => a - b));

  readonly hasSelection = computed(() => this._selectedIds().size > 0);

  isSelected(segment_id: number): boolean {
    return this._selectedIds().has(segment_id);
  }

  select(segment_id: number) {
    if(this.isSelected(segment_id)) return;

    const next = new Set(this._selectedIds());
    next.add(segment_id);
    this._selectedIds.set(next);
  }

  toggle(segment_id: number): void {
    const next = new Set(this._selectedIds());
    next.has(segment_id) ? next.delete(segment_id) : next.add(segment_id);
    this._selectedIds.set(next);
  }

  clear(): void {
    if (!this._selectedIds().size) return;
    this._selectedIds.set(new Set());
  }
}
