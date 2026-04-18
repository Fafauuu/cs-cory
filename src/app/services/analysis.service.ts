import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MatchAnalysis {
  id: string;
  date: string;
  map: string;
  opponent: string;
  resultT: number;
  resultCT: number;
  economy: string;
  utility: string;
  highlights: string;
  improvements: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private readonly STORAGE_KEY = 'cs-cory-analysis';
  
  private analysisSubject = new BehaviorSubject<MatchAnalysis[]>(this.loadAnalysis());
  public analysis$ = this.analysisSubject.asObservable();

  constructor() {}

  private loadAnalysis(): MatchAnalysis[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultAnalysis();
  }

  private getDefaultAnalysis(): MatchAnalysis[] {
    return [
      {
        id: '1',
        date: '2026-04-15',
        map: 'Dust II',
        opponent: 'Team Alpha',
        resultT: 12,
        resultCT: 8,
        economy: 'Stabilna, dobre buy rounndy',
        utility: 'Smokes + Flashes efektywne',
        highlights: 'Dobre kontrola A-site',
        improvements: 'Lepszy B-site control'
      },
      {
        id: '2',
        date: '2026-04-14',
        map: 'Mirage',
        opponent: 'Team Beta',
        resultT: 8,
        resultCT: 12,
        economy: 'Słaba gra eco',
        utility: 'Molotovy niewystarczające',
        highlights: 'A-site retake',
        improvements: 'Lepsza kontrola Lobby'
      }
    ];
  }

  getAnalysis(): Observable<MatchAnalysis[]> {
    return this.analysis$;
  }

  addAnalysis(analysis: Omit<MatchAnalysis, 'id'>): void {
    const newAnalysis: MatchAnalysis = {
      ...analysis,
      id: Date.now().toString()
    };
    const current = this.analysisSubject.value;
    const updated = [...current, newAnalysis];
    this.analysisSubject.next(updated);
    this.saveAnalysis(updated);
  }

  updateAnalysis(id: string, analysis: Omit<MatchAnalysis, 'id'>): void {
    const current = this.analysisSubject.value;
    const updated = current.map(a => a.id === id ? { ...analysis, id } : a);
    this.analysisSubject.next(updated);
    this.saveAnalysis(updated);
  }

  deleteAnalysis(id: string): void {
    const current = this.analysisSubject.value;
    const updated = current.filter(a => a.id !== id);
    this.analysisSubject.next(updated);
    this.saveAnalysis(updated);
  }

  private saveAnalysis(analysis: MatchAnalysis[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(analysis));
  }
}
