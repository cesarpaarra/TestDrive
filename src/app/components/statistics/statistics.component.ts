import { Component } from '@angular/core';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  results: any[] = [];

  view: [number, number] = [window.innerWidth, window.innerHeight];

  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Día';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Media de Aciertos';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.loadChartData();
    window.onresize = () => {
      this.view = [window.innerWidth, window.innerHeight];
    };
  }

  loadChartData(): void {
    const resultados = this.testService.getResultadosGroupedByDay();
    this.results = Object.keys(resultados).map(date => {
      const totalAciertos = resultados[date].reduce((acc, val) => acc + val.correctas, 0);
      const mediaAciertos = totalAciertos / resultados[date].length;
      return {
        name: date,
        value: mediaAciertos
      };
    });
  }
}
