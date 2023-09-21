//@ts-check
// timetable problem with genetic algorithm
//input data
const salas = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];
const dias = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-Feira",
  "Quinta-feira",
  "Sexta-feira",
];
const horarios = [
  "07h",
  "08h",
  "09h",
  "10h",
  "11h",
  "12h",
  "13h",
  "14h",
  "16h",
  "17h",
  "18h",
  "19h",
  "20h",
  "21h",
];

const turmaMateria = [
  ["Comp 1", "Algoritmos I", 3],
  ["Comp 1", "Geometria Analitica", 2],
  ["Comp 1", "Logica Matematica", 2],
  ["Comp 1", "Eletricidade Basica", 2],
  ["Comp 1", "Introducao a EC", 1],
  ["Comp 1", "Quimica Geral", 1],
  ["Comp 1", "Comunicacao Linguistica", 1],

  ["Comp 3", "Calculo II", 3],
  ["Comp 3", "Fisica I", 2],
  ["Comp 3", "Eletronica Analogica", 1],
  ["Comp 3", "MicroControladores", 1],
  ["Comp 3", "Estrutura de dados I", 2],
  ["Comp 3", "POO", 2],
  ["Comp 3", "Legislacao Digital", 1],

  ["Comp 5", "Calculo Numerico", 1],
  ["Comp 5", "Fisica III", 2],
  ["Comp 5", "Mecanica Geral", 1],
  ["Comp 5", "Eng de Software", 2],
  ["Comp 5", "Banco de Dados", 1],
  ["Comp 5", "SO", 2],
  ["Comp 5", "Grafos", 2],

  ["Comp 7", "Compiladores", 2],
  ["Comp 7", "Analise de Algoritmos", 2],
  ["Comp 7", "Gestao de Projetos", 2],
  ["Comp 7", "Sistemas Distribuidos", 2],

  ["Comp 9", "Big Data", 2],
  ["Comp 9", "Seguranca de Computadores", 2],
  ["Comp 9", "TCC I", 1],
  ["Comp 9", "Atividade de extensao I", 2],
  ["Comp 9", "Diversidade Educação e Trabalho", 1],
];

const professorMateria = [
  [
    "Joao Programador",
    [
      "Algoritmos I",
      "Estrutura de dados I",
      "POO",
      "Compiladores",
      "Analise de Algoritmos",
    ],
  ],
  [
    "Fernanda Matematica",
    ["Geometria Analitica", "Calculo II", "Calculo Numerico"],
  ],
  ["Maria Eletrica", ["Eletricidade Basica", "Eletronica Analogica"]],
  ["Jose Fisico", ["Fisica I", "Fisica III"]],
  [
    "Pedro Engenheiro",
    ["Mecanica Geral", "MicroControladores", "Sistemas Distribuidos"],
  ],
  ["Ana Quimica", ["Quimica Geral", "TCC I"]],
  [
    "Carlos Linguista",
    [
      "Comunicacao Linguistica",
      "Diversidade Educação e Trabalho",
      "Atividade de extensao I",
    ],
  ],
  ["Ricardo Matematica", ["Logica Matematica", "Grafos"]],
  [
    "Paulo Engenheiro",
    ["Introducao a EC", "Legislacao Digital", "Gestao de Projetos"],
  ],
  ["Marcos Engenheiro", ["Eng de Software", "Banco de Dados"]],
  ["Lucas Engenheiro", ["SO", "Seguranca de Computadores", "Big Data"]],
];

// const professorMateria = [
// //   ["P1", ["M1", "M2"]],
// //   ["P2", ["M3"]],
// //   ["P3", ["M4", "M5"]],
// //   ["P4", ["M6", "M7"]],
// //   ["P5", ["M1", "M2", "M3", "M4", "M5", "M6", "M7"]],
// ];

const turmaSalas = [
  ["Comp 1", "S1"],
  ["Comp 3", "S3"],
  ["Comp 5", "S5"],
  ["Comp 7", "S7"],
  ["Comp 9", "S2"],
];

const POPULATION_SIZE = 200;
const MAX_GENERATIONS = 2000;
const MUTATION_RATE = 0.05;

const TOURNAMENT_SIZE = 3;

function selectParents(population) {
  let parents = [];

  for (let i = 0; i < POPULATION_SIZE; i++) {
    let tournamentContestants = [];

    // Pick k individuals for the tournament
    for (let j = 0; j < TOURNAMENT_SIZE; j++) {
      let randomIndex = Math.floor(Math.random() * population.length);
      tournamentContestants.push(population[randomIndex]);
    }

    // Select the best individual among the k contestants
    let bestContestant = tournamentContestants.sort(
      (a, b) => evaluateFitness(b) - evaluateFitness(a)
    )[0];
    parents.push(bestContestant);
  }

  return parents;
}

// Initialization
function getTeacherForSubject(subject) {
  let possibleTeachers = professorMateria
    .filter((pair) => pair[1].includes(subject))
    .map((pair) => pair[0]);
  if (possibleTeachers.length === 0) return null;
  return possibleTeachers[Math.floor(Math.random() * possibleTeachers.length)];
}

function generateRandomTimetable() {
  let timetable = [];
  for (let [turma, materia, freq] of turmaMateria) {
    for (let i = 0; i < freq; i++) {
      let day = dias[Math.floor(Math.random() * dias.length)];
      let hour = horarios[Math.floor(Math.random() * horarios.length)];
      let room = turmaSalas.find((pair) => pair[0] === turma)[1];
      let teacher = getTeacherForSubject(materia);

      // Ensure that a valid teacher is assigned
      if (!teacher) continue; // or handle this more gracefully

      timetable.push([day, hour, room, turma, materia, teacher]);
    }
  }
  return timetable;
}

// Evaluation
function evaluateFitness(timetable) {
  let score = 0;

  //   // Check the restrictions and increment the score for every restriction met
  //   for (let i = 0; i < timetable.length; i++) {
  //     for (let j = i + 1; j < timetable.length; j++) {
  //       if (
  //         timetable[i][2] === timetable[j][2] &&
  //         timetable[i][0] === timetable[j][0] &&
  //         timetable[i][1] === timetable[j][1] &&
  //         timetable[i][3] === timetable[j][3] &&
  //         timetable[i][4] !== timetable[j][4]
  //       ) {
  //         score -= 100; // Heavy penalty
  //       }

  //       // Same room and time
  //       if (
  //         timetable[i][2] === timetable[j][2] &&
  //         timetable[i][0] === timetable[j][0] &&
  //         timetable[i][1] === timetable[j][1]
  //       )
  //         score--;

  //       // Same teacher and time
  //       if (
  //         timetable[i][5] === timetable[j][5] &&
  //         timetable[i][0] === timetable[j][0] &&
  //         timetable[i][1] === timetable[j][1]
  //       )
  //         score--;

  //       score++;
  //     }
  //   }
  let roomTimeSlots = new Map();
  let teacherTimeSlots = new Map();
  
  for (let [day, hour, room, _, __, teacher] of timetable) {
    let timeSlot = `${day}-${hour}`;

    // Same room and time
    if (roomTimeSlots.has(timeSlot)) {
      if (roomTimeSlots.get(timeSlot) !== room) {
        score -= 1000; // heavy penalty
      }
    } else {
      roomTimeSlots.set(timeSlot, room);
    }

    // Same teacher and time
    if (teacherTimeSlots.has(timeSlot)) {
      if (teacherTimeSlots.get(timeSlot) !== teacher) {
        score -= 1000; // heavy penalty
      }
    } else {
      teacherTimeSlots.set(timeSlot, teacher);
    }
  }

  // Penalize vacant slots (Soft Constraint)
  let totalPossibleSlots = dias.length * horarios.length * salas.length;
  let occupiedSlots = new Set();
  timetable.forEach((entry) => {
    occupiedSlots.add(entry[0] + "-" + entry[1] + "-" + entry[2]); // day-hour-room as key
  });
  score -= totalPossibleSlots - occupiedSlots.size; // You can adjust the penalty weight if needed

  return score;
}

// Crossover
function crossover(parent1, parent2) {
  const mid = Math.floor(parent1.length / 2);
  const firstHalf = parent1.slice(0, mid);
  const secondHalf = parent2.slice(mid);
  return firstHalf.concat(secondHalf);
}

// Mutation
function mutate(timetable) {
  if (Math.random() < MUTATION_RATE) {
    const randomIndex = Math.floor(Math.random() * timetable.length);
    const randomGene = Math.floor(Math.random() * 6);
    switch (randomGene) {
      case 0: // Day
        timetable[randomIndex][0] =
          dias[Math.floor(Math.random() * dias.length)];
        break;
      case 1: // Hour
        timetable[randomIndex][1] =
          horarios[Math.floor(Math.random() * horarios.length)];
        break;
      case 2: // Room
        // Keeping room tied to the class for simplicity
        break;
      case 3: // Class
        // Keeping class tied to the room for simplicity
        break;
      case 4: // Subject
        // Keeping subject tied to the class for simplicity
        break;
      case 5: // Teacher
        let currentSubject = timetable[randomIndex][4];
        let possibleTeachers = professorMateria
          .filter((pair) => pair[1].includes(currentSubject))
          .map((pair) => pair[0]);
        let randomTeacher =
          possibleTeachers[Math.floor(Math.random() * possibleTeachers.length)];
        timetable[randomIndex][5] = randomTeacher;
        break;
    }
  }
}

let population = Array.from({ length: POPULATION_SIZE }, () =>
  generateRandomTimetable()
);

for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
  // Selection
  let parents = selectParents(population);

  // Crossover and Mutation
  let newPopulation = [];
  for (let i = 0; i < POPULATION_SIZE; i += 2) {
    let child1 = crossover(parents[i], parents[i + 1]);
    let child2 = crossover(parents[i + 1], parents[i]);

    mutate(child1);
    mutate(child2);

    newPopulation.push(child1, child2);
  }

  population = newPopulation;
}

// // Get the best solution from the population
// let bestSolution = population.sort(
//   (a, b) => evaluateFitness(b) - evaluateFitness(a)
// )[0];

// console.table(bestSolution);

const ELITISM_COUNT = 5;


// ... [rest of your code] ...

function geneticAlgorithm() {
  // Initialization of the initial population
  let population = Array.from({ length: POPULATION_SIZE }, () =>
    generateRandomTimetable()
  );

  for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
    let newPopulation = [];

    // Elitism: Preserve the best individuals
    population.sort((a, b) => evaluateFitness(b) - evaluateFitness(a)); // Sort in descending order
    for (let i = 0; i < ELITISM_COUNT; i++) {
      newPopulation.push(population[i]);
    }

    // Selection of parents
    let parents = selectParents(population);

    // Crossover and Mutation to produce offspring
    for (let i = 0; i < POPULATION_SIZE - ELITISM_COUNT; i += 2) {
      let child1 = crossover(parents[i], parents[i + 1]);
      let child2 = crossover(parents[i + 1], parents[i]);

      mutate(child1);
      mutate(child2);

      newPopulation.push(child1, child2);
    }

    population = newPopulation;

    // (Optional) Print the best solution of this generation
    console.log(
      "Generation:",
      generation,
      "Best Score:",
      evaluateFitness(population[0])
    );
  }

  return population[0]; // Return the best timetable
}

let bestTimetable = geneticAlgorithm();
console.log("Best Timetable:", bestTimetable); // You can replace this with a better visualization later

function timetableToMarkdown(timetable) {
  // Create the header of the Markdown table
  let mdTable = "| Day | Hour | Room | Class | Subject | Teacher |\n";
  mdTable += "|-----|------|------|-------|---------|---------|\n";

  // Sort timetable for a clearer representation
  timetable.sort((a, b) => {
    if (a[0] !== b[0]) return dias.indexOf(a[0]) - dias.indexOf(b[0]); // Sort by day
    if (a[1] !== b[1]) return horarios.indexOf(a[1]) - horarios.indexOf(b[1]); // Then sort by hour
    return salas.indexOf(a[2]) - salas.indexOf(b[2]); // Lastly, sort by room
  });

  // Add each timetable entry to the Markdown table
  for (let entry of timetable) {
    mdTable += `| ${entry.join(" | ")} |\n`;
  }

  return mdTable;
}

// Example usage
let markdown = timetableToMarkdown(bestTimetable);

const fs = require("fs");
fs.writeFileSync("GAtimetable.md", `${new Date()}\n` + markdown);

//escrevendo um csv com fs usando o bestTimetable
const str = "Day,Hour,Room,Class,Subject,Teacher\n";
const rows = bestTimetable.map((row) => row.join(","));
fs.writeFileSync("GAtimetable.csv", str + rows.join("\n"));

const turmasTimetable = {};

// bestTimetable.forEach((row) => {
//   turmasTimetable[row[3]] = turmasTimetable[row[3]].push(row);
// });

