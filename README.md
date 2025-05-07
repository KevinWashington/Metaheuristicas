# Problema da Mochila usando Algoritmo Genético

Este projeto implementa uma solução para o clássico Problema da Mochila (Knapsack Problem) utilizando um Algoritmo Genético.

## Aluno

Kevin Washington Azevedo da Cruz

## Sobre o Problema da Mochila

O Problema da Mochila é um problema de otimização combinatória:

- Temos 100 itens, cada um com um valor e um peso específicos
- Uma mochila com capacidade limitada (1550 unidades de peso)
- Objetivo: Maximizar o valor total dos itens selecionados sem exceder a capacidade da mochila

## Parâmetros do Algoritmo Genético

- Tamanho da população: 100 indivíduos
- Número de gerações: 200
- Total de avaliações: 20.000
- Taxa de crossover (recombinação): 0.8 (80%)
- Taxa de mutação: 0.1 (10%)
- Seleção: Torneio (com tamanho 3)

## Como Executar

1. Certifique-se de ter o Node.js instalado
2. Crie um arquivo `knapsack-instance.txt` no mesmo diretório com o formato:
   ```
   [número de itens]
   [capacidade da mochila]
   [valor1] [peso1]
   [valor2] [peso2]
   ...
   [valorN] [pesoN]
   ```
3. Execute o algoritmo:
   ```
   node GA.js
   ```

## Estrutura do Código

O código está organizado da seguinte forma:

- `parseKnapsackInstance()`: Função para ler e analisar o arquivo de instância
- Classe `GeneticAlgorithm`: Implementa o algoritmo genético com métodos para:
  - Inicialização da população
  - Cálculo de fitness
  - Seleção por torneio
  - Crossover (recombinação de um ponto)
  - Mutação
  - Evolução da população
- `analyzeSolution()`: Função para analisar a melhor solução encontrada
- `runExperiment()`: Função para executar múltiplas rodadas do algoritmo e calcular estatísticas

## Resultados

O algoritmo executa 20 rodadas independentes e apresenta estatísticas como:

- Média de fitness
- Desvio padrão
- Melhor resultado
- Pior resultado

Além disso, para a melhor solução encontrada, são apresentados:

- Valor total
- Peso total
- Índices dos itens selecionados
