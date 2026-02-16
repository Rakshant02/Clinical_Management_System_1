import { Injectable, signal, effect } from '@angular/core';
import { Observation } from '../models';

@Injectable({ providedIn: 'root' })
export class ObservationService {
  private readonly KEY = 'observations';
  private _list = signal<Observation[]>([]);

  constructor() {
    // Load from storage once
    const raw = localStorage.getItem(this.KEY) || '[]';
    try { this._list.set(JSON.parse(raw)); } catch { this._list.set([]); }

    // Auto-persist on any change
    effect(() => {
      localStorage.setItem(this.KEY, JSON.stringify(this._list()));
    });
  }

  /** Return current array snapshot (your components already call listSig()) */
  listSig(): Observation[] {
    return this._list();
  }

  /** Create a new observation */
  add(e: Omit<Observation, 'ObservationID'>): Observation {
    const created: Observation = { ObservationID: genId('OBS'), ...e };
    this._list.set([created, ...this._list()]);
    return created;
  }

  /**
   * Update existing observation IN PLACE by ObservationID.
   * - Does NOT generate a new id
   * - Does NOT push a new row
   * - Merges fields and keeps the original ObservationID
   */
  async update(updated: Observation): Promise<void> {
    const list = this._list();
    const idx = list.findIndex(o => String(o.ObservationID) === String(updated.ObservationID));
    if (idx === -1) throw new Error('Observation not found');

    const next = [...list];
    // lock the ID to avoid accidental key changes
    next[idx] = { ...list[idx], ...updated, ObservationID: list[idx].ObservationID };
    this._list.set(next);
  }

  /** Optional: update by id with a patch (if you prefer this signature) */
  async updateById(id: string, patch: Partial<Observation>): Promise<void> {
    const list = this._list();
    const idx = list.findIndex(o => String(o.ObservationID) === String(id));
    if (idx === -1) throw new Error('Observation not found');

    const next = [...list];
    next[idx] = { ...list[idx], ...patch, ObservationID: list[idx].ObservationID };
    this._list.set(next);
  }

  /** Optional: find by id */
  find(id: string): Observation | undefined {
    return this._list().find(o => String(o.ObservationID) === String(id));
  }

  /** Optional: remove by id */
  remove(id: string): void {
    const next = this._list().filter(o => String(o.ObservationID) !== String(id));
    this._list.set(next);
  }
}

/** Simple ID generator */
function genId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `${prefix}${ts}${rand}`;
}