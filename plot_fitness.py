import matplotlib.pyplot as plt
import numpy as np

# Dados das execuções - formato [execução][posição na execução (0-9 para as gerações 20, 40, ..., 200)]
fitness_data = [
    [1953, 1953, 1953, 1953, 2014, 2014, 2014, 2014, 2040, 2040],  # Run 1
    [1991, 1991, 1991, 1991, 1994, 2037, 2037, 2037, 2037, 2037],  # Run 2
    [1954, 1954, 2008, 2008, 2008, 2008, 2008, 2008, 2008, 2008],  # Run 3
    [2013, 2013, 2013, 2013, 2013, 2013, 2013, 2013, 2013, 2013],  # Run 4
    [2036, 2036, 2036, 2036, 2036, 2036, 2036, 2036, 2036, 2036],  # Run 5
    [2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026, 2026],  # Run 6
    [1983, 1983, 1983, 1983, 2013, 2013, 2013, 2013, 2013, 2013],  # Run 7
    [2028, 2028, 2028, 2028, 2028, 2028, 2028, 2028, 2028, 2028],  # Run 8
    [2005, 2005, 2005, 2005, 2005, 2005, 2006, 2056, 2056, 2056],  # Run 9
    [1940, 1940, 1960, 1960, 1960, 1960, 2060, 2060, 2060, 2060],  # Run 10
    [0, 1879, 1879, 1879, 1879, 1974, 1974, 1974, 1974, 1974],     # Run 11
    [1958, 1958, 1977, 2005, 2005, 2005, 2005, 2086, 2086, 2086],  # Run 12
    [1871, 1919, 1996, 1996, 1996, 1996, 1996, 1996, 1996, 2001],  # Run 13
    [1874, 1874, 1945, 1945, 1945, 1994, 1994, 1994, 1994, 1994],  # Run 14
    [1960, 1960, 1960, 1960, 2000, 2006, 2010, 2010, 2010, 2010],  # Run 15
    [0, 1980, 1980, 1980, 1980, 1980, 1980, 1993, 1993, 1993],     # Run 16
    [1966, 1966, 1966, 1970, 1970, 2056, 2056, 2056, 2056, 2056],  # Run 17
    [1917, 1917, 2021, 2021, 2021, 2021, 2021, 2021, 2021, 2021],  # Run 18
    [2007, 2007, 2007, 2007, 2007, 2007, 2007, 2007, 2007, 2007],  # Run 19
    [0, 2023, 2023, 2023, 2025, 2025, 2025, 2025, 2025, 2025]      # Run 20
]

# Gerações onde o fitness foi medido
generations = [20, 40, 60, 80, 100, 120, 140, 160, 180, 200]

# Criar figura e eixos
plt.figure(figsize=(12, 7))

# Selecionar apenas a execução 12
selected_runs = [11]  # Execução 12 (melhor)
colors = ['#8E24AA']
labels = ['Execução 12 (Melhor)']

# Plotar as linhas selecionadas
for i, run in enumerate(selected_runs):
    if run == 11:  # Melhor execução (índice 11 = execução 12)
        plt.plot(generations, fitness_data[run], marker='o', color=colors[i], 
                 linewidth=3, label=labels[i])
    else:
        plt.plot(generations, fitness_data[run], marker='o', color=colors[i], 
                 linewidth=1.5, label=labels[i])

# # Adicionar linha média de todas as execuções
# avg_fitness = np.mean(fitness_data, axis=0)
# plt.plot(generations, avg_fitness, marker='', color='black', 
#          linewidth=2, linestyle='--', label='Média de todas execuções')

# Configurar o gráfico
plt.title('Evolução do Fitness ao Longo das Gerações', fontsize=16)
plt.xlabel('Geração', fontsize=14)
plt.ylabel('Fitness', fontsize=14)
plt.grid(True, linestyle='--', alpha=0.7)
plt.legend(loc='lower right')

# Salvar o gráfico
plt.savefig('fitness_evolution.png', dpi=300, bbox_inches='tight')

# Exibir estatísticas
print("===== ESTATÍSTICAS DO EXPERIMENTO =====")
print(f"Média do Fitness Final: {np.mean([row[-1] for row in fitness_data]):.2f}")
print(f"Desvio Padrão: {np.std([row[-1] for row in fitness_data]):.2f}")
print(f"Melhor Fitness: {max([row[-1] for row in fitness_data])}")
print(f"Pior Fitness: {min([row[-1] for row in fitness_data])}")

plt.show()