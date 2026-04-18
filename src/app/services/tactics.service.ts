import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Tactic {
  id: string;
  name: string;
  description: string;
  team: 'T' | 'CT';
  map: string;
  difficulty: 'easy' | 'medium' | 'hard';
  buyRound: 'eco' | 'half-buy' | 'full-buy';
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class TacticsService {
  private readonly STORAGE_KEY = 'cs-cory-tactics';
  
  private tacticsSubject = new BehaviorSubject<Tactic[]>(this.loadTactics());
  public tactics$ = this.tacticsSubject.asObservable();

  constructor() {}

  private loadTactics(): Tactic[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultTactics();
  }

  private getDefaultTactics(): Tactic[] {
    return [
      {
        id: '1',
        name: 'Rush B',
        description: 'Szybki atak na bombsite B z wykorzystaniem smokes.',
        team: 'T',
        map: 'Dust II',
        difficulty: 'easy',
        buyRound: 'full-buy',
        notes: 'Wymaga dobrych timingu i komuniki'
      },
      {
        id: '2',
        name: 'Default A',
        description: 'Kontrola środkowej części mapy i rozstawienie w kluczowych punktach.',
        team: 'T',
        map: 'Mirage',
        difficulty: 'medium',
        buyRound: 'full-buy',
        notes: 'Standardowa taktyka, elastyczna'
      },
      {
        id: '3',
        name: 'Retake',
        description: 'Plan obronny po straceniu terenu.',
        team: 'CT',
        map: 'Inferno',
        difficulty: 'hard',
        buyRound: 'full-buy',
        notes: 'Wymaga szybkich decyzji'
      }
    ];
  }

  getTactics(): Observable<Tactic[]> {
    return this.tactics$;
  }

  addTactic(tactic: Omit<Tactic, 'id'>): void {
    const newTactic: Tactic = {
      ...tactic,
      id: Date.now().toString()
    };
    const current = this.tacticsSubject.value;
    const updated = [...current, newTactic];
    this.tacticsSubject.next(updated);
    this.saveTactics(updated);
  }

  updateTactic(id: string, tactic: Omit<Tactic, 'id'>): void {
    const current = this.tacticsSubject.value;
    const updated = current.map(t => t.id === id ? { ...tactic, id } : t);
    this.tacticsSubject.next(updated);
    this.saveTactics(updated);
  }

  deleteTactic(id: string): void {
    const current = this.tacticsSubject.value;
    const updated = current.filter(t => t.id !== id);
    this.tacticsSubject.next(updated);
    this.saveTactics(updated);
  }

  private saveTactics(tactics: Tactic[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tactics));
  }
}
