import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/space-invaders/game-board"

export default function SpaceInvadersPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Space Invaders</h1>
                <p className="text-muted-foreground">
                    Defenda a Terra dos alienígenas invasores! Controle sua nave espacial e destrua as naves inimigas antes que elas cheguem até você.
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
                    <p>1. Use as setas ⬅️ e ➡️ do teclado ou os botões na tela para mover sua nave</p>
                    <p>2. Pressione a barra de espaço ou o botão "Atirar" para disparar contra os alienígenas</p>
                    <p>3. Destrua todos os alienígenas antes que eles cheguem até sua nave</p>
                    <p>4. Cada alienígena destruído vale 100 pontos</p>
                    <p>5. O jogo termina se algum alienígena atingir sua nave</p>
                </CardContent>
            </Card>
        </div>
    )
} 