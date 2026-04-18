import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService, MatchAnalysis } from '../services/analysis.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  analysisList: MatchAnalysis[] = [];
  showForm = false;
  editingId: string | null = null;

  formData = this.getEmptyForm();

  constructor(private analysisService: AnalysisService) {}

  ngOnInit(): void {
    this.analysisService.getAnalysis().subscribe(analysis => {
      this.analysisList = analysis;
    });
  }

  private getEmptyForm() {
    return {
      date: new Date().toISOString().split('T')[0],
      map: 'Dust II',
      opponent: '',
      resultT: 0,
      resultCT: 0,
      economy: '',
      utility: '',
      highlights: '',
      improvements: ''
    };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingId = null;
      this.formData = this.getEmptyForm();
    }
  }

  saveAnalysis(): void {
    if (!this.formData.opponent.trim()) {
      alert('Nazwa przeciwnika jest wymagana');
      return;
    }

    if (this.editingId) {
      this.analysisService.updateAnalysis(this.editingId, this.formData);
      this.editingId = null;
    } else {
      this.analysisService.addAnalysis(this.formData);
    }

    this.formData = this.getEmptyForm();
    this.showForm = false;
  }

  editAnalysis(analysis: MatchAnalysis): void {
    this.formData = { ...analysis };
    this.editingId = analysis.id;
    this.showForm = true;
  }

  deleteAnalysis(id: string): void {
    if (confirm('Czy na pewno chcesz usunąć tę analizę?')) {
      this.analysisService.deleteAnalysis(id);
    }
  }

  getResultClass(resultT: number, resultCT: number): string {
    if (resultT > resultCT) return 'win';
    if (resultT < resultCT) return 'loss';
    return 'draw';
  }

  getWinRate(): number {
    if (this.analysisList.length === 0) return 0;
    const wins = this.analysisList.filter(a => a.resultT > a.resultCT).length;
    return Math.round((wins / this.analysisList.length) * 100);
  }
}
