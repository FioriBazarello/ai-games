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
                    <p>1. Use as setas do teclado ou os botões para mover a nave</p>
                    <p>2. Pressione a barra de espaço ou o botão &quot;Atirar&quot; para disparar</p>
                    <p>3. Destrua todos os aliens para avançar ao próximo nível</p>
                    <p>4. Não deixe os aliens chegarem até sua nave!</p>
                </CardContent>
            </Card>
        </div>
    )
} 