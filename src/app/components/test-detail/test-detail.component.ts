import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrl: './test-detail.component.css'
})
export class TestDetailComponent implements OnInit {
  testDetalle: Test | undefined;
  currentPreguntaIndex: number = 0;
  respuestasSeleccionadas: { [key: number]: string } = {};
  testFinalizado: boolean = false;
  numCorrectas: number = 0;
  resultados: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute,
    private testService: TestService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.testDetalle = this.testService.getTestDetalle(id);
    const progreso = this.testService.getProgreso(id);
    if (progreso) {
      this.currentPreguntaIndex = progreso.currentPreguntaIndex;
      this.respuestasSeleccionadas = progreso.respuestasSeleccionadas;
    }
  }

  seleccionarRespuesta(preguntaIndex: number, letra: string): void {
    if (!this.testFinalizado) {
      this.respuestasSeleccionadas[preguntaIndex] = letra;
      this.saveProgreso();
    }
  }

  esContestada(preguntaIndex: number): boolean {
    return this.respuestasSeleccionadas[preguntaIndex] !== undefined;
  }

  esCorrecta(preguntaIndex: number): boolean {
    const respuestaSeleccionada = this.respuestasSeleccionadas[preguntaIndex];
    const pregunta = this.testDetalle?.preguntas[preguntaIndex];
    return pregunta?.opciones.find(op => op.letra === respuestaSeleccionada)?.esCorrecta || false;
  }

  nextPregunta(): void {
    if (this.testDetalle && this.currentPreguntaIndex < this.testDetalle.preguntas.length) {
      this.currentPreguntaIndex++;
      if (this.currentPreguntaIndex === this.testDetalle.preguntas.length) {
        this.finalizarTest();
      } else {
        this.saveProgreso();
      }
    }
  }

  prevPregunta(): void {
    if (this.currentPreguntaIndex > 0) {
      this.currentPreguntaIndex--;
      this.saveProgreso();
    }
  }

  goToPregunta(index: number): void {
    this.currentPreguntaIndex = index;
    this.saveProgreso();
  }

  finalizarTest(): void {
    if (this.testDetalle) {
      this.numCorrectas = 0;
      this.testDetalle.preguntas.forEach((pregunta, index) => {
        this.resultados[index] = this.esCorrecta(index);
        if (this.resultados[index]) {
          this.numCorrectas++;
        }
      });
      this.testFinalizado = true;
      this.testService.saveResultados(this.testDetalle.id, this.numCorrectas, this.testDetalle.preguntas.length);
      this.testService.clearProgreso(this.testDetalle.id);
    }
  }

  saveProgreso(): void {
    if (this.testDetalle) {
      this.testService.saveProgreso(this.testDetalle.id, this.currentPreguntaIndex, this.respuestasSeleccionadas);
    }
  }
}