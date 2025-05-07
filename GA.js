// Aluno: Kevin Washington Azevedo da Cruz
/**
 * Knapsack Problem Implementation using Genetic Algorithm
 *
 * Problem:
 * - 100 items with values and weights
 * - Knapsack capacity of 1550
 * - Goal: Maximize total value while keeping total weight under capacity
 *
 * Genetic Algorithm Parameters:
 * - Population size: 100
 * - Number of generations: 200 (total evaluations: 20,000)
 * - Crossover rate: 0.8
 * - Mutation rate: 0.1
 * - Selection: Tournament selection
 */

function parseKnapsackInstance(filePath) {
  const fs = require("fs");
  const fileContent = fs.readFileSync(filePath, "utf8");

  const lines = fileContent.trim().split("\n");
  const numItems = parseInt(lines[0], 10);
  const capacity = parseInt(lines[1], 10);

  const items = [];
  for (let i = 0; i < numItems; i++) {
    const [value, weight] = lines[i + 2]
      .trim()
      .split(/\s+/)
      .map((x) => parseInt(x, 10));
    items.push({ value, weight });
  }

  return { numItems, capacity, items };
}

const knapsackFilePath = "./knapsack-instance.txt";

const { numItems, capacity, items } = parseKnapsackInstance(knapsackFilePath);

class GeneticAlgorithm {
  constructor(
    items,
    capacity,
    populationSize = 100,
    generations = 200,
    crossoverRate = 0.8,
    mutationRate = 0.1
  ) {
    this.items = items;
    this.capacity = capacity;
    this.populationSize = populationSize;
    this.generations = generations;
    this.crossoverRate = crossoverRate;
    this.mutationRate = mutationRate;
    this.evaluationCount = 0;
    this.maxEvaluations = 20000;
    this.bestSolution = null;
    this.bestFitness = 0;
  }

  initializePopulation() {
    const population = [];
    for (let i = 0; i < this.populationSize; i++) {
      const chromosome = [];
      for (let j = 0; j < this.items.length; j++) {
        chromosome.push(Math.random() < 0.5 ? 0 : 1);
      }
      population.push(chromosome);
    }
    return population;
  }

  calculateFitness(chromosome) {
    this.evaluationCount++;

    let totalValue = 0;
    let totalWeight = 0;

    for (let i = 0; i < chromosome.length; i++) {
      if (chromosome[i] === 1) {
        totalValue += this.items[i].value;
        totalWeight += this.items[i].weight;
      }
    }

    if (totalWeight > this.capacity) {
      return 0;
    }

    return totalValue;
  }

  selection(population, fitnesses) {
    const tournamentSize = 3;
    const selected = [];

    for (let i = 0; i < population.length; i++) {
      const competitors = [];
      for (let j = 0; j < tournamentSize; j++) {
        const index = Math.floor(Math.random() * population.length);
        competitors.push({ index, fitness: fitnesses[index] });
      }

      competitors.sort((a, b) => b.fitness - a.fitness);

      selected.push([...population[competitors[0].index]]);
    }

    return selected;
  }

  crossover(parent1, parent2) {
    if (Math.random() > this.crossoverRate) {
      return [parent1, parent2];
    }

    const crossoverPoint = Math.floor(Math.random() * parent1.length);
    const child1 = [
      ...parent1.slice(0, crossoverPoint),
      ...parent2.slice(crossoverPoint),
    ];
    const child2 = [
      ...parent2.slice(0, crossoverPoint),
      ...parent1.slice(crossoverPoint),
    ];

    return [child1, child2];
  }

  mutation(chromosome) {
    const mutated = [...chromosome];
    for (let i = 0; i < mutated.length; i++) {
      if (Math.random() < this.mutationRate) {
        mutated[i] = mutated[i] === 0 ? 1 : 0;
      }
    }
    return mutated;
  }

  evolve() {
    let population = this.initializePopulation();

    for (
      let generation = 0;
      generation < this.generations &&
      this.evaluationCount < this.maxEvaluations;
      generation++
    ) {
      const fitnesses = population.map((chromosome) =>
        this.calculateFitness(chromosome)
      );

      const maxFitnessIndex = fitnesses.indexOf(Math.max(...fitnesses));

      const currentBestFitness = fitnesses[maxFitnessIndex];

      if (currentBestFitness > this.bestFitness) {
        this.bestFitness = currentBestFitness;
        this.bestSolution = [...population[maxFitnessIndex]];
      }

      const selected = this.selection(population, fitnesses);

      const newPopulation = [];
      for (let i = 0; i < this.populationSize / 2; i++) {
        const parent1 = selected[Math.floor(Math.random() * selected.length)];
        const parent2 = selected[Math.floor(Math.random() * selected.length)];

        const [child1, child2] = this.crossover(parent1, parent2);
        newPopulation.push(this.mutation(child1));
        newPopulation.push(this.mutation(child2));

        if (this.evaluationCount >= this.maxEvaluations) {
          break;
        }
      }

      population = newPopulation;

      // Log progress
      if ((generation + 1) % 20 === 0) {
        console.log(
          `Generation ${generation + 1}, Best Fitness: ${
            this.bestFitness
          }, Evaluations: ${this.evaluationCount}`
        );
      }
    }

    return {
      solution: this.bestSolution,
      fitness: this.bestFitness,
      evaluations: this.evaluationCount,
    };
  }
}

function analyzeSolution(solution, items) {
  let totalValue = 0;
  let totalWeight = 0;
  const selectedItems = [];

  for (let i = 0; i < solution.length; i++) {
    if (solution[i] === 1) {
      totalValue += items[i].value;
      totalWeight += items[i].weight;
      selectedItems.push({
        index: i + 1,
        value: items[i].value,
        weight: items[i].weight,
      });
    }
  }

  return { totalValue, totalWeight, selectedItems };
}

function runExperiment(numRuns = 20) {
  const results = [];

  for (let run = 1; run <= numRuns; run++) {
    console.log(`Run ${run}/${numRuns}`);

    const ga = new GeneticAlgorithm(items, capacity);
    const result = ga.evolve();
    const analysis = analyzeSolution(result.solution, items);

    results.push({
      run,
      fitness: result.fitness,
      totalValue: analysis.totalValue,
      totalWeight: analysis.totalWeight,
      selectedItems: analysis.selectedItems,
    });

    console.log(
      `Run ${run} completed with fitness: ${result.fitness}, value: ${analysis.totalValue}, weight: ${analysis.totalWeight}`
    );
  }

  const fitnessValues = results.map((r) => r.fitness);
  const mean = fitnessValues.reduce((sum, val) => sum + val, 0) / numRuns;
  const variance =
    fitnessValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    numRuns;
  const stdDev = Math.sqrt(variance);
  const best = Math.max(...fitnessValues);
  const worst = Math.min(...fitnessValues);

  console.log("\n===== EXPERIMENT RESULTS =====");
  console.log(`Runs: ${numRuns}`);
  console.log(`Mean Fitness: ${mean}`);
  console.log(`Standard Deviation: ${stdDev}`);
  console.log(`Best Fitness: ${best}`);
  console.log(`Worst Fitness: ${worst}`);

  const bestRun = results.find((r) => r.fitness === best);
  console.log("\n===== BEST SOLUTION =====");
  console.log(`Run: ${bestRun.run}`);
  console.log(`Total Value: ${bestRun.totalValue}`);
  console.log(`Total Weight: ${bestRun.totalWeight}`);
  console.log(
    `Selected Items Indexes: ${bestRun.selectedItems
      .map((item) => item.index)
      .join(", ")}`
  );

  return {
    results,
    statistics: {
      mean,
      stdDev,
      best,
      worst,
    },
  };
}

const experiment = runExperiment(20);
console.log(JSON.stringify(experiment.statistics, null, 2));
