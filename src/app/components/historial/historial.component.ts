import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent {
  historial: { date: string, tests: { id: number, correctas: number, total: number }[] }[] = [];

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadHistorial();
  }

  loadHistorial(): void {
    const resultados = this.testService.getResultadosGroupedByDay();
    this.historial = Object.keys(resultados).map(date => {
      return {
        date: date,
        tests: resultados[date]
      };
    });
  }
}
