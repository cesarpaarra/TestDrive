import { Injectable } from '@angular/core';
import { Test } from '../models/test';
import * as testData from '../../assets/tests.json';
import { Pregunta } from '../models/pregunta';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private allPreguntas: Pregunta[] = [];
  private temarioPreguntas: Pregunta[] = [];
  private tests: Test[] = [];
  private temarioTests: { [key: string]: Test[] } = {};
  private seed: number = 12345;
  private resultados: { [key: string]: { correctas: number; total: number; date: string; id: number }[] } = {};
  private progresos: { [key: number]: { currentPreguntaIndex: number, respuestasSeleccionadas: { [key: number]: string } } } = {};
  private dificultades: { [key: number]: string } = {};

  constructor() {
    this.loadPreguntas();
    this.loadTemarioPreguntas();
    this.loadDificultades();
    this.generateTests();
    this.generateTemarioTests();
    this.loadResultados();
    this.loadProgresos();
  }

  private loadPreguntas(): void {
    this.allPreguntas = (testData as any).default.map((item: any, index: number) => ({
      id: index + 1,
      img: 'assets/' + item.img,
      pregunta: item.pregunta,
      opciones: [
        { letra: 'a', texto: item['a.'], esCorrecta: item.correcta.split(' ')[0] === '1' },
        { letra: 'b', texto: item['b.'], esCorrecta: item.correcta.split(' ')[1] === '1' },
        { letra: 'c', texto: item['c.'], esCorrecta: item.correcta.split(' ')[2] === '1' }
      ],
      explicacion: item.explicacion
    }));
  }

  private loadTemarioPreguntas(): void {
    this.temarioPreguntas = (testData as any).default.slice(0, 400).map((item: any, index: number) => ({
      id: index + 1 + 1000,
      img: 'assets/' + item.img,
      pregunta: item.pregunta,
      opciones: [
        { letra: 'a', texto: item['a.'], esCorrecta: item.correcta.split(' ')[0] === '1' },
        { letra: 'b', texto: item['b.'], esCorrecta: item.correcta.split(' ')[1] === '1' },
        { letra: 'c', texto: item['c.'], esCorrecta: item.correcta.split(' ')[2] === '1' }
      ],
      explicacion: item.explicacion
    }));
  }

  private generateTests(): void {
    for (let i = 1; i <= 100; i++) {
      const preguntas = this.getRandomPreguntas(this.allPreguntas, 30, this.seed + i);
      const dificultad = this.getDificultad(i);
      this.tests.push({
        id: i,
        titulo: `Test ${i}`,
        preguntas: preguntas,
        dificultad: dificultad
      });
    }
  }

  private generateTemarioTests(): void {
    const temarios = [
      'Temario 1', 'Temario 2', 'Temario 3', 'Temario 4', 'Temario 5',
      'Temario 6', 'Temario 7', 'Temario 8', 'Temario 9', 'Temario 10',
      'Temario 11', 'Temario 12'
    ];
    temarios.forEach((temario, index) => {
      this.temarioTests[temario] = [];
      for (let i = 1; i <= 4; i++) {
        const testId = (index * 4 + i) + 1000;
        const preguntas = this.getRandomPreguntas(this.temarioPreguntas, 30, this.seed + index * 10 + i);
        const dificultad = this.getDificultad(testId);
        this.temarioTests[temario].push({
          id: testId,
          titulo: `${temario} - Test ${i}`,
          preguntas: preguntas,
          dificultad: dificultad
        });
      }
    });
  }

  private getRandomPreguntas(preguntas: Pregunta[], num: number, seed: number): Pregunta[] {
    const shuffled = this.seededShuffle([...preguntas], seed);
    return shuffled.slice(0, num);
  }

  private seededShuffle(array: any[], seed: number): any[] {
    let m = array.length, t, i;

    while (m) {
      i = Math.floor(this.random(seed) * m--);

      t = array[m];
      array[m] = array[i];
      array[i] = t;

      seed++;
    }

    return array;
  }

  private random(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private getRandomDificultad(): string {
    const dificultades = ['facil', 'media', 'dificil'];
    return dificultades[Math.floor(Math.random() * dificultades.length)];
  }

  private getDificultad(testId: number): string {
    if (!this.dificultades[testId]) {
      this.dificultades[testId] = this.getRandomDificultad();
      this.saveDificultades();
    }
    return this.dificultades[testId];
  }

  private saveDificultades(): void {
    localStorage.setItem('dificultades', JSON.stringify(this.dificultades));
  }

  private loadDificultades(): void {
    const dificultades = localStorage.getItem('dificultades');
    if (dificultades) {
      this.dificultades = JSON.parse(dificultades);
    }
  }

  saveResultados(testId: number, correctas: number, total: number): void {
    const today = new Date().toISOString().split('T')[0];
    if (!this.resultados[today]) {
      this.resultados[today] = [];
    }
    this.resultados[today].push({ correctas, total, date: today, id: testId });
    localStorage.setItem('resultados', JSON.stringify(this.resultados));
    this.clearProgreso(testId);
  }

  loadResultados(): void {
    const resultados = localStorage.getItem('resultados');
    if (resultados) {
      this.resultados = JSON.parse(resultados);
      for (const date in this.resultados) {
        if (!Array.isArray(this.resultados[date])) {
          this.resultados[date] = [];
        }
      }
    }
  }

  saveProgreso(testId: number, currentPreguntaIndex: number, respuestasSeleccionadas: { [key: number]: string }): void {
    if (currentPreguntaIndex < this.tests.find(test => test.id === testId)?.preguntas.length) {
      this.progresos[testId] = { currentPreguntaIndex, respuestasSeleccionadas };
      localStorage.setItem('progresos', JSON.stringify(this.progresos));
    } else {
      this.clearProgreso(testId);
    }
  }

  loadProgresos(): void {
    const progresos = localStorage.getItem('progresos');
    if (progresos) {
      this.progresos = JSON.parse(progresos);
    }
  }

  clearProgreso(testId: number): void {
    delete this.progresos[testId];
    localStorage.setItem('progresos', JSON.stringify(this.progresos));
  }

  getTests(): Test[] {
    return this.tests;
  }

  getTestDetalle(id: number): Test | undefined {
    return this.tests.find(test => test.id === id) || this.getTemarioTestDetalle(id);
  }

  private getTemarioTestDetalle(id: number): Test | undefined {
    for (const key in this.temarioTests) {
      const test = this.temarioTests[key].find(test => test.id === id);
      if (test) {
        return test;
      }
    }
    return undefined;
  }

  getTemarioTests(): { [key: string]: Test[] } {
    return this.temarioTests;
  }

  getResultado(testId: number): { correctas: number; total: number; date: string; id: number }[] | undefined {
    const resultadosArray = Object.values(this.resultados).flat();
    return resultadosArray.filter(result => result.id === testId);
  }

  getUltimoResultado(testId: number): { correctas: number; total: number; date: string; id: number } | undefined {
    const resultadosArray = Object.values(this.resultados).flat();
    return resultadosArray.filter(result => result.id === testId).pop();
  }

  getProgreso(testId: number): { currentPreguntaIndex: number, respuestasSeleccionadas: { [key: number]: string } } | undefined {
    return this.progresos[testId];
  }

  getResultadosGroupedByDay(): { [key: string]: { id: number, correctas: number, total: number }[] } {
    const groupedResults: { [key: string]: { id: number, correctas: number, total: number }[] } = {};
    for (const date in this.resultados) {
      if (Array.isArray(this.resultados[date])) {
        groupedResults[date] = this.resultados[date].map(result => ({
          id: result.id,
          correctas: result.correctas,
          total: result.total
        }));
      }
    }
    return groupedResults;
  }
}
