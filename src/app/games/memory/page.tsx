import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/memory/game-board"

export default function MemoryGamePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Jogo da Memória</h1>
                <p className="text-muted-foreground">
                    Encontre todos os pares de cartas para vencer!
                </p>
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
                    <p>1. Clique em uma carta para revelá-la</p>
                    <p>2. Tente encontrar o par correspondente</p>
                    <p>3. Se as cartas forem iguais, elas ficam reveladas</p>
                    <p>4. Se forem diferentes, elas viram novamente</p>
                    <p>5. Complete todos os pares com o menor número de movimentos!</p>
                </CardContent>
            </Card>
        </div>
    )
} 