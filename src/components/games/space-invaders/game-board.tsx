"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

interface SpaceShip {
    x: number
    y: number
}

interface Alien {
    x: number
    y: number
    alive: boolean
}

interface Projectile {
    x: number
    y: number
}

interface GameState {
    ship: SpaceShip
    aliens: Alien[]
    projectiles: Projectile[]
    score: number
    gameOver: boolean
    gameStarted: boolean
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const SHIP_SIZE = 40
const ALIEN_SIZE = 30
const PROJECTILE_SIZE = 5

export function GameBoard() {
    const [gameState, setGameState] = useState<GameState>({
        ship: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - SHIP_SIZE },
        aliens: [],
        projectiles: [],
        score: 0,
        gameOver: false,
        gameStarted: false
    })

    const initGame = useCallback(() => {
        // Criar grid de aliens
        const aliens: Alien[] = []
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                aliens.push({
                    x: col * (ALIEN_SIZE + 20) + 100,
                    y: row * (ALIEN_SIZE + 20) + 50,
                    alive: true
                })
            }
        }

        setGameState(prev => ({
            ...prev,
            aliens,
            projectiles: [],
            score: 0,
            gameOver: false,
            gameStarted: true
        }))
    }, [])

    const moveShip = useCallback((direction: "left" | "right") => {
        setGameState(prev => {
            const newX = direction === "left"
                ? Math.max(0, prev.ship.x - 10)
                : Math.min(CANVAS_WIDTH - SHIP_SIZE, prev.ship.x + 10)

            return {
                ...prev,
                ship: { ...prev.ship, x: newX }
            }
        })
    }, [])

    const shoot = useCallback(() => {
        setGameState(prev => ({
            ...prev,
            projectiles: [...prev.projectiles, {
                x: prev.ship.x + SHIP_SIZE / 2,
                y: prev.ship.y
            }]
        }))
    }, [])

    useEffect(() => {
        if (!gameState.gameStarted || gameState.gameOver) return

        const gameLoop = setInterval(() => {
            setGameState(prev => {
                // Mover projéteis
                const updatedProjectiles = prev.projectiles
                    .map(p => ({ ...p, y: p.y - 5 }))
                    .filter(p => p.y > 0)

                // Mover aliens
                const updatedAliens = prev.aliens.map(alien => ({
                    ...alien,
                    y: alien.y + 0.2
                }))

                // Verificar colisões
                updatedProjectiles.forEach(projectile => {
                    updatedAliens.forEach(alien => {
                        if (alien.alive &&
                            projectile.x > alien.x &&
                            projectile.x < alien.x + ALIEN_SIZE &&
                            projectile.y > alien.y &&
                            projectile.y < alien.y + ALIEN_SIZE) {
                            alien.alive = false
                        }
                    })
                })

                // Verificar game over
                const gameOver = updatedAliens.some(alien =>
                    alien.alive && alien.y + ALIEN_SIZE >= prev.ship.y)

                return {
                    ...prev,
                    projectiles: updatedProjectiles,
                    aliens: updatedAliens,
                    score: prev.aliens.filter(a => !a.alive).length * 100,
                    gameOver
                }
            })
        }, 1000 / 60)

        return () => clearInterval(gameLoop)
    }, [gameState.gameStarted, gameState.gameOver])

    useEffect(() => {
        if (!gameState.gameStarted || gameState.gameOver) return

        const handleKeyPress = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    moveShip("left")
                    break
                case "ArrowRight":
                    moveShip("right")
                    break
                case " ":
                    shoot()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [gameState.gameStarted, gameState.gameOver, moveShip, shoot])

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-between w-full mb-4">
                <div className="text-xl font-bold">Pontuação: {gameState.score}</div>
                {!gameState.gameStarted && (
                    <Button onClick={initGame}>Iniciar Jogo</Button>
                )}
                {gameState.gameOver && (
                    <Button onClick={initGame}>Jogar Novamente</Button>
                )}
            </div>

            <canvas
                id="gameCanvas"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 bg-black"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            />

            <div className="flex gap-4 mt-4">
                <Button
                    onMouseDown={() => moveShip("left")}
                    disabled={!gameState.gameStarted || gameState.gameOver}
                >
                    ⬅️ Esquerda
                </Button>
                <Button
                    onClick={shoot}
                    disabled={!gameState.gameStarted || gameState.gameOver}
                >
                    🚀 Atirar
                </Button>
                <Button
                    onMouseDown={() => moveShip("right")}
                    disabled={!gameState.gameStarted || gameState.gameOver}
                >
                    Direita ➡️
                </Button>
            </div>
        </div>
    )
} 