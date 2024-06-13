import { Pregunta } from "./pregunta";

export interface Test {
  id: number;
  titulo: string;
  dificultad: string;
  preguntas: Pregunta[];
}
  