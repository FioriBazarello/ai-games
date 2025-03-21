import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/tetris/game-board"

export default function TetrisPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Tetris</h1>
                <p className="text-muted-foreground">Clássico jogo de blocos onde você deve encaixar as peças para completar linhas</p>
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
                    <p>1. Use as setas ← → para mover as peças</p>
                    <p>2. Use a seta ↑ para rotacionar</p>
                    <p>3. Use a seta ↓ para acelerar a queda</p>
                    <p>4. Pressione Espaço para queda instantânea</p>
                    <p>5. Complete linhas para marcar pontos</p>
                </CardContent>
            </Card>
        </div>
    )
} 