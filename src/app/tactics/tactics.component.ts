import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TacticsService, Tactic } from '../services/tactics.service';

@Component({
  selector: 'app-tactics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tactics.component.html',
  styleUrls: ['./tactics.component.css']
})
export class TacticsComponent implements OnInit {
  tactics: Tactic[] = [];
  selectedTeam: 'T' | 'CT' = 'T';
  showForm = false;
  editingId: string | null = null;

  formData = this.getEmptyForm();

  constructor(private tacticsService: TacticsService) {}

  ngOnInit(): void {
    this.tacticsService.getTactics().subscribe(tactics => {
      this.tactics = tactics;
    });
  }

  private getEmptyForm() {
    return {
      name: '',
      description: '',
      team: 'T' as 'T' | 'CT',
      map: 'Dust II',
      difficulty: 'medium' as 'easy' | 'medium' | 'hard',
      buyRound: 'full-buy' as 'eco' | 'half-buy' | 'full-buy',
      notes: ''
    };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingId = null;
      this.formData = this.getEmptyForm();
    }
  }

  saveTactic(): void {
    if (!this.formData.name.trim()) {
      alert('Nazwa taktyki jest wymagana');
      return;
    }

    if (this.editingId) {
      this.tacticsService.updateTactic(this.editingId, this.formData);
      this.editingId = null;
    } else {
      this.tacticsService.addTactic(this.formData);
    }

    this.formData = this.getEmptyForm();
    this.showForm = false;
  }

  editTactic(tactic: Tactic): void {
    this.formData = { ...tactic };
    this.editingId = tactic.id;
    this.showForm = true;
  }

  deleteTactic(id: string): void {
    if (confirm('Czy na pewno chcesz usunąć tę taktykę?')) {
      this.tacticsService.deleteTactic(id);
    }
  }

  getFilteredTactics(): Tactic[] {
    return this.tactics.filter(t => t.team === this.selectedTeam);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '#238636';
      case 'medium': return '#3b8bdb';
      case 'hard': return '#f85149';
      default: return '#6e7681';
    }
  }
}
