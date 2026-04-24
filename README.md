# Simulador de Escala 5×2

Dashboard interativo para simulação e análise de escalas de trabalho **5×2**, comparando com o modelo **6×1**, voltado para operações de Separação e Recebimento.

## Estrutura

```
simulador-5x2/
├── index.html   # Estrutura e marcação HTML
├── style.css    # Estilos e layout responsivo
├── app.js       # Lógica de cálculo e renderização
└── README.md
```

## Funcionalidades

- Configuração de carga horária semanal e pack médio
- Seleção do modelo de trabalho (Segunda a Sexta / Equipes revezando)
- Tabelas comparativas 6×1 e 5×2 para Separação e Recebimento
- Diferença de quadro e média diária entre os modelos
- Gráfico de barras de capacidade produtiva por setor
- Escala semanal visual das equipes
- KPIs com delta entre modelos

## Como usar

Basta abrir o `index.html` em qualquer navegador moderno. Não requer servidor ou dependências externas.

## GitHub Pages

Para publicar via GitHub Pages:
1. Faça o push dos arquivos para um repositório público
2. Vá em **Settings → Pages**
3. Selecione a branch `main` e pasta `/ (root)`
4. Acesse o link gerado pelo GitHub Pages

## Cálculos

Todos os cálculos seguem a metodologia original do simulador, utilizando `Math.ceil` (equivalente ao `ROUNDUP` do Excel):

- **Volumetria pack médio** = ROUNDUP(Meta / Pack Médio)
- **Média diária** = ROUNDUP(Volumetria / dias úteis)
- **Quadro necessário** = ROUNDUP(Média diária / Produtividade / dias úteis)
- **Horas produtivas** = Carga diária − 1,8 h (pausas)

## 🧠 Desafios Interativos (Novo!)

Nova seção **"Desafios de Lógica de Programação"** com **4 exercícios práticos** no final da página:

1. **Calcular quadro necessário** — Use `Math.ceil` para simular ROUNDUP.
2. **Somar metas semanais** — Pratique `array.reduce()`.
3. **Simular buildBlock** — Lógica completa de um setor.
4. **Média diária com pack** — Condicional usaPack e cálculos encadeados.

**Como resolver**:
- Edite o código na textarea (com lacunas indicadas).
- Clique **Verificar Resposta** — feedback imediato ✅/❌.
- **Limpar** para resetar.

Perfeito para aprender a lógica do simulador enquanto pratica JavaScript essencial (arrays, map/reduce, Math.ceil).

**Dica**: Abra o Console do navegador (F12) para depurar `console.log()`.

## Estrutura Atualizada

```
simulador-5x2/
├── index.html   # + Seção desafios interativa
├── style.css    # + Estilos para desafios (dark code, feedback)
├── app.js       # + CHALLENGES, render/check funcs
├── README.md    # Docs atualizadas
└── TODO.md      # Rastreamento (auto-gerado)
```
