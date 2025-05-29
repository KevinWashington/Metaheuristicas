class Item {
  constructor(value, weight) {
    this.value = value;
    this.weight = weight;
    this.ratio = value / weight;
  }
}

class Individual {
  constructor(size) {
    this.genes = new Array(size).fill(false);
    this.fitness = 0;
    this.weight = 0;
    this.valid = true;
  }

  clone() {
    const clone = new Individual(this.genes.length);
    clone.genes = [...this.genes];
    clone.fitness = this.fitness;
    clone.weight = this.weight;
    clone.valid = this.valid;
    return clone;
  }
}

class GeneticAlgorithm {
  constructor(items, capacity, popSize = 200, mutRate = 0.02, crossRate = 0.8) {
    this.items = items;
    this.capacity = capacity;
    this.populationSize = popSize;
    this.mutationRate = mutRate;
    this.crossoverRate = crossRate;

    this.MAX_INDIVIDUALS = 20000;

    this.generations = Math.floor(this.MAX_INDIVIDUALS / this.populationSize);
  }

  random() {
    return Math.random();
  }

  randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  evaluateIndividual(individual) {
    individual.fitness = 0;
    individual.weight = 0;

    for (let i = 0; i < this.items.length; i++) {
      if (individual.genes[i]) {
        individual.fitness += this.items[i].value;
        individual.weight += this.items[i].weight;
      }
    }

    if (individual.weight > this.capacity) {
      individual.valid = false;
      individual.fitness = 0;
    } else {
      individual.valid = true;
    }
  }

  createIndividual() {
    const individual = new Individual(this.items.length);
    const indices = Array.from({ length: this.items.length }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = this.randomInt(i + 1);
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let currentWeight = 0;
    for (const idx of indices) {
      if (
        this.random() < 0.3 &&
        currentWeight + this.items[idx].weight <= this.capacity
      ) {
        individual.genes[idx] = true;
        currentWeight += this.items[idx].weight;
      }
    }

    return individual;
  }

  initializePopulation() {
    const population = [];

    for (let i = 0; i < this.populationSize; i++) {
      population.push(this.createIndividual());
    }

    for (const individual of population) {
      this.evaluateIndividual(individual);
    }

    return population;
  }

  selection(population, tournamentSize = 3) {
    let best = population[this.randomInt(population.length)];

    for (let i = 1; i < tournamentSize; i++) {
      const candidate = population[this.randomInt(population.length)];
      if (candidate.fitness > best.fitness) {
        best = candidate;
      }
    }

    return best.clone();
  }

  crossover(parent1, parent2) {
    const child1 = new Individual(this.items.length);
    const child2 = new Individual(this.items.length);

    const crossoverPoint = Math.floor(Math.random() * parent1.length);


    // Crossover uniforme
    for (let i = 0; i < this.items.length; i++) {
      if (this.random() < 0.5) {
        child1.genes[i] = parent1.genes[i];
        child2.genes[i] = parent2.genes[i];
      } else {
        child1.genes[i] = parent2.genes[i];
        child2.genes[i] = parent1.genes[i];
      }
    }

    // // Crossover de um ponto
    // child1.genes = [
    //   ...parent1.genes.slice(0, crossoverPoint),
    //   ...parent2.genes.slice(crossoverPoint),
    // ];
    // child2.genes = [
    //   ...parent2.genes.slice(0, crossoverPoint),
    //   ...parent1.genes.slice(crossoverPoint),
    // ];

    return [child1, child2];
  }

  mutate(individual) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.random() < this.mutationRate) {
        individual.genes[i] = !individual.genes[i];
      }
    }
  }

  repairSolution(individual) {
    individual.weight = 0;
    individual.fitness = 0;

    for (let i = 0; i < this.items.length; i++) {
      if (individual.genes[i]) {
        individual.weight += this.items[i].weight;
        individual.fitness += this.items[i].value;
      }
    }

    while (individual.weight > this.capacity) {
      const selectedItems = [];
      for (let i = 0; i < this.items.length; i++) {
        if (individual.genes[i]) {
          selectedItems.push(i);
        }
      }

      if (selectedItems.length === 0) break;

      let worstIdx = selectedItems[0];
      let worstRatio = this.items[worstIdx].ratio;

      for (const idx of selectedItems) {
        if (this.items[idx].ratio < worstRatio) {
          worstRatio = this.items[idx].ratio;
          worstIdx = idx;
        }
      }

      individual.genes[worstIdx] = false;
      individual.weight -= this.items[worstIdx].weight;
      individual.fitness -= this.items[worstIdx].value;
    }

    for (let i = 0; i < this.items.length; i++) {
      if (
        !individual.genes[i] &&
        individual.weight + this.items[i].weight <= this.capacity
      ) {
        individual.genes[i] = true;
        individual.weight += this.items[i].weight;
        individual.fitness += this.items[i].value;
      }
    }

    individual.valid = individual.weight <= this.capacity;
  }

  solve() {
    let population = this.initializePopulation();

    let bestSolution = population.reduce(
      (best, current) =>
        current.fitness > best.fitness ? current.clone() : best,
      population[0].clone()
    );

    for (
      let gen = 0;
      gen <= this.generations;
      gen++
    ) {
      const newPopulation = [];

      // Elitismo - mantém os melhores 10% da população
      population.sort((a, b) => b.fitness - a.fitness);

      const eliteSize = Math.floor(this.populationSize * 0.1);
      for (let i = 0; i < eliteSize; i++) {
        newPopulation.push(population[i].clone());
      }

      while (newPopulation.length < this.populationSize) {
        const parent1 = this.selection(population);
        const parent2 = this.selection(population);

        let child1, child2;
        if (this.random() < this.crossoverRate) {
          [child1, child2] = this.crossover(parent1, parent2);
        } else {
          child1 = parent1.clone();
          child2 = parent2.clone();
        }

        this.mutate(child1);
        this.mutate(child2);

        this.repairSolution(child1);
        this.repairSolution(child2);
        this.evaluateIndividual(child1);
        this.evaluateIndividual(child2);
        

        newPopulation.push(child1);
        if (
          newPopulation.length < this.populationSize
        ) {
          newPopulation.push(child2);
        }
      }

      population = newPopulation;

      const currentBest = population.reduce((best, current) =>
        current.fitness > best.fitness ? current : best
      );

      if (currentBest.fitness > bestSolution.fitness) {
        bestSolution = currentBest.clone();
      }

      // // Saída de progresso
      // if (gen % 20 === 0) {
      //   console.log(
      //     `Geração ${gen} - Melhor: ${bestSolution.fitness}`
      //   );
      // }
    }
    return bestSolution;
  }
}

function parseKnapsackFile(fileContent) {
  const lines = fileContent.trim().split("\n");

  if (lines.length < 3) {
    throw new Error("Arquivo de instância inválido");
  }

  const numItems = parseInt(lines[0]);
  const capacity = parseInt(lines[1]);

  const items = [];
  for (let i = 2; i < lines.length; i++) {
    const parts = lines[i].trim().split(/\s+/);

    const value = parseInt(parts[0]);
    const weight = parseInt(parts[1]);

    items.push(new Item(value, weight));
  }

  return { numItems, capacity, items };
}

async function readKnapsackFile(filename = "knapsack-instance.txt") {
  const fs = require("fs").promises;

  try {
    const fileContent = await fs.readFile(filename, "utf8");
    return parseKnapsackFile(fileContent);
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filename}:`, error.message);
    throw error;
  }
}

async function runExperiment( runs, filename = "knapsack-instance.txt") {
  const { numItems, capacity, items } = await readKnapsackFile(filename);

  let bestRun = {
    fitness: 0,
    weight: 0,
    genes: [],
    runs: 0
  };


  const results = [];

  for (let run = 1; run <= runs; run++) {
    const ga = new GeneticAlgorithm(items, capacity, 200, 0.02, 0.8);
    const best = ga.solve();

    results.push(best.fitness);

    if (!bestRun || best.fitness > bestRun.fitness) {
      bestRun = {
        fitness: best.fitness,
        weight: best.weight,
        genes: best.genes,
        runs: run
      }
    }
  }

  const mean = results.reduce((sum, val) => sum + val, 0) / results.length;

  const variance =
    results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    results.length;
  const stddev = Math.sqrt(variance);

  const best = Math.max(...results);
  const worst = Math.min(...results);

  console.log(`=== RESULTADOS DO EXPERIMENTO ===`);
  console.log(`Execuções: ${runs}`);
  console.log(`Média: ${mean}`);
  console.log(`Desvio Padrão: ${stddev}`);
  console.log(`Melhor Fitness: ${best}`);
  console.log(`Pior Fitness: ${worst}`);

  console.log("\n===== MELHOR SOLUÇÃO =====");
  console.log(`Run: ${bestRun.runs}`);
  console.log(`Valor total: ${bestRun.fitness}`);
  console.log(`Peso total: ${bestRun.weight}`);
  console.log(
    `Índices de itens selecionados: ${bestRun.genes
      .reduce((acc, item, index) => {
        if (item) {
          acc.push(index);
        }
        return acc;
      }, [])
      .join(", ")}`
  );

  return { mean, stddev, best, worst, results };
}

runExperiment(20)

