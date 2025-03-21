import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/pong/game-board"

export default function PongGamePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Pong</h1>
                <p className="text-muted-foreground">
                    Jogue contra o computador e veja quantos pontos consegue fazer!
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
                    <p>1. Use as teclas ↑ e ↓ ou W e S para mover sua raquete</p>
                    <p>2. Não deixe a bola passar pela sua raquete</p>
                    <p>3. Cada vez que você marca um ponto, a velocidade aumenta</p>
                    <p>4. O jogo termina quando o computador marca 5 pontos</p>
                    <p>5. Tente fazer o maior número de pontos possível!</p>
                </CardContent>
            </Card>
        </div>
    )
} 