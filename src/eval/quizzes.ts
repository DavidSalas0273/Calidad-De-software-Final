export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: string;
  hint?: string;
}

export interface QuizDefinition {
  quizId: string;
  moduleKey: string;
  moduleTitle: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export const math3dQuiz: QuizDefinition = {
  quizId: "math3d-basics",
  moduleKey: "matematicas",
  moduleTitle: "Matemáticas 3D",
  title: "Quiz de Formas 3D",
  description: "Valida conceptos de volumen, caras y transformaciones del cubo interactivo.",
  questions: [
    {
      id: "q1",
      prompt: "¿Cuántas caras tiene un cubo regular?",
      options: ["4", "6", "8", "12"],
      answer: "6",
    },
    {
      id: "q2",
      prompt: "Si duplicas la longitud de cada arista del cubo, ¿cómo cambia su volumen?",
      options: ["Se mantiene igual", "Se duplica", "Se triplica", "Se multiplica por 8"],
      answer: "Se multiplica por 8",
      hint: "Volumen = arista³",
    },
    {
      id: "q3",
      prompt: "¿Qué eje se usa para rotar el cubo de izquierda a derecha en la escena?",
      options: ["Eje X", "Eje Y", "Eje Z", "Eje XY"],
      answer: "Eje Y",
    },
    {
      id: "q4",
      prompt: "¿Cuántas aristas comparte un vértice de un cubo?",
      options: ["2", "3", "4", "6"],
      answer: "3",
    },
    {
      id: "q5",
      prompt: "Al proyectar un cubo sobre un plano, ¿qué figura plana se obtiene normalmente?",
      options: ["Triángulo", "Círculo", "Cuadrado", "Hexágono"],
      answer: "Cuadrado",
    },
  ],
};
