import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GameBoard } from "@/components/games/snake/game-board"

export default function SnakeGamePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Snake Game</h1>
                <p className="text-muted-foreground">
                    Coma as frutas, cresça e evite colidir!
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

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Como Jogar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>1. Use as teclas WASD para controlar a cobra:</p>
                        <p className="ml-4">• W - Mover para cima</p>
                        <p className="ml-4">• A - Mover para esquerda</p>
                        <p className="ml-4">• S - Mover para baixo</p>
                        <p className="ml-4">• D - Mover para direita</p>
                        <p>2. Em dispositivos móveis, use os botões na tela</p>
                        <p>3. Coma as frutas vermelhas para crescer e ganhar pontos</p>
                        <p>4. Evite colidir com as paredes</p>
                        <p>5. Não colida com seu próprio corpo</p>
                        <p>6. Tente bater seu recorde!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Dicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>• Planeje seus movimentos com antecedência</p>
                        <p>• Mantenha espaço suficiente para manobrar</p>
                        <p>• Use as bordas do tabuleiro para se orientar</p>
                        <p>• Em velocidades maiores, evite movimentos bruscos</p>
                        <p>• Pratique para melhorar seus reflexos</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 