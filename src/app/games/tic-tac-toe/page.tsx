import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/tic-tac-toe/game-board"

export default function TicTacToePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Jogo da Velha</h1>
                <p className="text-muted-foreground">
                    Faça uma linha, coluna ou diagonal para vencer!
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
                    <p>1. O jogador X começa o jogo</p>
                    <p>2. Clique em qualquer espaço vazio para fazer sua jogada</p>
                    <p>3. Os jogadores alternam entre X e O</p>
                    <p>4. Complete uma linha, coluna ou diagonal para vencer</p>
                    <p>5. Se ninguém conseguir, é empate!</p>
                </CardContent>
            </Card>
        </div>
    )
} 