🎮 Guia de Desenvolvimento - AI Games
================================

Este documento serve como guia completo para o desenvolvimento do projeto AI Games, incluindo estrutura, padrões e instruções para adicionar novos jogos.

## 📑 Índice

1. @Estrutura do Projeto
2. @Tecnologias Utilizadas
3. @Padrões de Código
4. @Criando Novos Jogos
   - Estrutura de Arquivos
   - Adicionando à Página Principal
   - Página do Jogo
   - Componente do Jogo
   - Atualizando a Documentação
5. @Boas Práticas
6. @Deploy e Publicação
7. @Controle de Versão

## 📁 Estrutura do Projeto

```
ai-games/
├── src/
│   ├── app/                    # Rotas e páginas
│   │   ├── games/             # Páginas dos jogos
│   │   │   ├── memory/        # Jogo da Memória
│   │   │   ├── pong/          # Pong
│   │   │   ├── snake/         # Snake Game
│   │   │   ├── space-invaders/ # Space Invaders
│   │   │   ├── tetris/        # Tetris
│   │   │   └── tic-tac-toe/   # Jogo da Velha
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes React
│   │   ├── games/            # Componentes dos jogos
│   │   ├── ui/               # Componentes de UI
│   │   └── site-header.tsx   # Cabeçalho do site
│   └── lib/                  # Utilitários e configurações
├── public/                   # Arquivos estáticos
├── docs/                    # Documentação
└── package.json            # Dependências
```

## 🛠 Tecnologias Utilizadas

- **Framework**: Next.js 15
- **Linguagem**: TypeScript
- **Estilização**: 
  - Tailwind CSS
  - shadcn/ui (componentes)
- **Ícones**: Lucide Icons
- **Temas**: next-themes

## 💻 Padrões de Código

### Nomenclatura

- **Arquivos**: 
  - Componentes: PascalCase (ex: `GameBoard.tsx`)
  - Utilitários: camelCase (ex: `useGameLogic.ts`)
  - Páginas: minúsculas com hífen (ex: `tic-tac-toe`)

- **Componentes**:
  - Nome do componente em PascalCase
  - Props interface com sufixo Props
  - Tipos com prefixo T ou interface I

```tsx
interface GameBoardProps {
    difficulty?: "easy" | "medium" | "hard"
    onGameEnd?: (score: number) => void
}

export function GameBoard({ difficulty = "medium", onGameEnd }: GameBoardProps) {
    // ...
}
```

### Organização de Arquivos

- Um componente por arquivo
- Tipos relacionados no mesmo arquivo do componente
- Hooks personalizados em arquivos separados
- Utilitários agrupados por funcionalidade

### Estilização

- Priorizar classes do Tailwind
- Usar CSS-in-JS apenas quando necessário
- Manter consistência com o tema do projeto
- Suportar modo claro e escuro

## 🎮 Criando Novos Jogos

### 1. Estrutura de Arquivos

```
src/
├── app/games/[nome-do-jogo]/
│   └── page.tsx              # Página do jogo
└── components/games/[nome-do-jogo]/
    ├── game-board.tsx        # Componente principal
    ├── types.ts             # Tipos (opcional)
    └── utils.ts             # Utilitários (opcional)
```

### 2. Adicionando à Página Principal

No arquivo `src/app/page.tsx`, adicione o jogo à lista `games`:

```tsx
const games = [
  // ... jogos existentes ...
  {
    id: 4, // Incremente o ID
    title: "Nome do Jogo",
    description: "Uma breve descrição do jogo",
    image: "/games/nome-do-jogo.png", // Adicione a imagem em public/games/
    route: "/games/nome-do-jogo"
  }
]
```

**Importante**:
1. Incremente o ID sequencialmente
2. Use uma descrição clara e concisa
3. Adicione uma imagem representativa em `public/games/`
4. A rota deve corresponder ao diretório do jogo em `src/app/games/`

### 3. Página do Jogo (page.tsx)

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/[nome-do-jogo]/game-board"

export default function GamePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Nome do Jogo</h1>
                <p className="text-muted-foreground">Descrição</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Partida em andamento</CardTitle>
                </CardHeader>
                <CardContent>
                    <GameBoard />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Como Jogar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p>1. Primeira instrução</p>
                    <p>2. Segunda instrução</p>
                </CardContent>
            </Card>
        </div>
    )
}
```

### 4. Componente do Jogo (game-board.tsx)

```tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

type GameState = {
    // Estado do jogo
}

export function GameBoard() {
    const [gameState, setGameState] = useState<GameState>({
        // Estado inicial
    })

    // Lógica do jogo aqui

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Interface do jogo */}
        </div>
    )
}
```

### 5. Atualizando a Documentação

Após criar um novo jogo, é **OBRIGATÓRIO** atualizar a documentação:

1. **No README.md**:
   - Adicione o jogo na seção "🎲 Jogos Disponíveis"
   - Inclua uma breve descrição do jogo
   - Mantenha o padrão de formatação dos jogos existentes

2. **No GUIA_DESENVOLVIMENTO.md**:
   - Atualize a estrutura de diretórios na seção "📁 Estrutura do Projeto"
   - Adicione o novo jogo na lista de diretórios em `src/app/games/`
   - Mantenha a ordem alfabética dos jogos

Exemplo de atualização no README.md:
```markdown
### Nome do Novo Jogo
Breve descrição do jogo, destacando suas principais características e modo de jogo.
```

## ✨ Boas Práticas

### Performance

1. **Otimizações React**:
   - Use `useCallback` para funções props
   - Use `useMemo` para cálculos pesados
   - Evite re-renderizações desnecessárias
   - Implemente `React.memo` quando apropriado

2. **Jogos com Animações**:
   - Prefira Canvas para jogos com muitas animações
   - Use `requestAnimationFrame` em vez de `setInterval`
   - Implemente double buffering quando necessário
   - Otimize operações de renderização

3. **Gerenciamento de Estado**:
   - Mantenha o estado mínimo necessário
   - Use `useReducer` para lógica complexa
   - Considere context para estados globais

### Acessibilidade

1. **Controles**:
   - Suporte a teclado
   - Controles alternativos para touch
   - Feedback visual e sonoro
   - Instruções claras

2. **Visual**:
   - Contraste adequado
   - Tamanhos de fonte legíveis
   - Ícones com significado claro
   - Suporte a temas

### Responsividade

1. **Layout**:
   - Design mobile-first
   - Breakpoints consistentes
   - Unidades relativas
   - Testes em múltiplos dispositivos

2. **Interação**:
   - Controles adaptados para touch
   - Áreas de clique adequadas
   - Feedback tátil quando possível

## 🚀 Deploy e Publicação

### 1. Construção do Projeto

```
npm run build
```

### 2. Publicação

#### 2.1. Hospedagem em um Servidor

1. Faça o upload dos arquivos construídos para o servidor
2. Configure o servidor para servir os arquivos estáticos

#### 2.2. Hospedagem em um Serviço de Hospedagem de Aplicações

1. Faça o upload do projeto para o serviço de hospedagem
2. Configure o serviço para servir os arquivos estáticos

## 🔄 Controle de Versão

### Branches e Features

1. **Criação de Branches**:
   - Antes de iniciar o desenvolvimento de um novo jogo, SEMPRE crie uma nova branch
   - Use o padrão: `feature/add-nome-do-jogo`
   - Exemplo: `feature/add-tetris-game`

2. **Workflow de Desenvolvimento**:
   ```bash
   # Criar e mudar para nova branch
   git checkout -b feature/add-nome-do-jogo

   # Subir branch para o repositório remoto
   git push -u origin feature/add-nome-do-jogo
   ```

### Commits e Push

1. **Regras de Commit**:
   - NUNCA faça commits sem a solicitação e permissão expressa do desenvolvedor
   - Use mensagens claras e em português
   - Siga o padrão de commits convencionais:
     - `feat: adiciona novo jogo X`
     - `fix: corrige bug no jogo Y`
     - `docs: atualiza documentação`
     - `style: ajusta estilo do componente`

2. **Push Automático**:
   - Após cada commit autorizado, SEMPRE faça push para a branch remota
   - Exemplo:
     ```bash
     git add .
     git commit -m "feat: adiciona jogo do tetris"
     git push
     ```

3. **Boas Práticas**:
   - Mantenha commits pequenos e focados
   - Faça push frequentemente para evitar conflitos
   - Não acumule muitas alterações sem commit
   - Sempre verifique em qual branch está antes de começar a trabalhar
