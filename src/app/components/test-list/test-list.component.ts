import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {
  tests: Test[] = [];
  filteredTests: Test[] = [];
  selectedDificultad: string = 'todas';

  constructor(public testService: TestService) {}

  ngOnInit(): void {
    this.tests = this.testService.getTests();
    this.filteredTests = this.tests;
  }

  filterTests(): void {
    if (this.selectedDificultad === 'todas') {
      this.filteredTests = this.tests;
    } else {
      this.filteredTests = this.tests.filter(test => test.dificultad === this.selectedDificultad);
    }
  }

  getUltimoIntento(testId: number): { correctas: number; total: number; date: string; id: number } | undefined {
    return this.testService.getUltimoResultado(testId);
  }
}