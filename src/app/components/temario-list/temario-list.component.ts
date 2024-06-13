import { Component, OnInit } from '@angular/core';
import { TestService } from '../../services/test.service';
import { Test } from '../../models/test';

@Component({
  selector: 'app-temario-list',
  templateUrl: './temario-list.component.html',
  styleUrls: ['./temario-list.component.css']
})
export class TemarioListComponent implements OnInit {
  temarioTests: { [key: string]: Test[] } = {};
  objectKeys = Object.keys;

  constructor(private testService: TestService) {}

  ngOnInit(): void {
    this.temarioTests = this.testService.getTemarioTests();
  }

  getUltimoIntento(testId: number): { correctas: number; total: number; date: string; id: number } | undefined {
    return this.testService.getUltimoResultado(testId);
  }
}
