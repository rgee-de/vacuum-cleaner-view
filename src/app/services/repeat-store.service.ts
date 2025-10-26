import {effect, Injectable, signal} from '@angular/core';

const STORAGE_KEY = 'numberOfRepetition';

@Injectable({
  providedIn: 'root'
})
export class RepeatStoreService {
  private readonly _numberOfRepetition = signal<number>(this._loadFromStorage());

  readonly numberOfRepetition = this._numberOfRepetition.asReadonly();

  constructor() {
    effect(() => localStorage.setItem(STORAGE_KEY, String(this._numberOfRepetition())));
  }

  setRepetition(rep: number) {
    if (rep < 1 || rep > 3) return;
    this._numberOfRepetition.set(rep);
  }

  private _loadFromStorage(): number {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? parseInt(stored, 10) : NaN;
    return [1, 2, 3].includes(parsed) ? parsed : 1;
  }
}
