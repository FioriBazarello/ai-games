"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"

interface SpaceShip {
    x: number
    y: number
}

interface Alien {
    x: number
    y: number
    alive: boolean
    direction: "right" | "left"
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
    aliensDirection: "right" | "left"
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const SHIP_SIZE = 40
const ALIEN_SIZE = 30
const PROJECTILE_SIZE = 5
const SHIP_SPEED = 15
const ALIEN_SPEED = 2
const PROJECTILE_SPEED = 8

export function GameBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gameState, setGameState] = useState<GameState>({
        ship: { x: CANVAS_WIDTH / 2 - SHIP_SIZE / 2, y: CANVAS_HEIGHT - SHIP_SIZE - 10 },
        aliens: [],
        projectiles: [],
        score: 0,
        gameOver: false,
        gameStarted: false,
        aliensDirection: "right"
    })

    const initGame = useCallback(() => {
        // Criar grid de aliens
        const aliens: Alien[] = []
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                aliens.push({
                    x: col * (ALIEN_SIZE + 20) + 100,
                    y: row * (ALIEN_SIZE + 20) + 50,
                    alive: true,
                    direction: "right"
                })
            }
        }

        setGameState(prev => ({
            ...prev,
            ship: { x: CANVAS_WIDTH / 2 - SHIP_SIZE / 2, y: CANVAS_HEIGHT - SHIP_SIZE - 10 },
            aliens,
            projectiles: [],
            score: 0,
            gameOver: false,
            gameStarted: true,
            aliensDirection: "right"
        }))
    }, [])

    const moveShip = useCallback((direction: "left" | "right") => {
        setGameState(prev => {
            const newX = direction === "left"
                ? Math.max(0, prev.ship.x - SHIP_SPEED)
                : Math.min(CANVAS_WIDTH - SHIP_SIZE, prev.ship.x + SHIP_SPEED)

            return {
                ...prev,
                ship: { ...prev.ship, x: newX }
            }
        })
    }, [])

    const shoot = useCallback(() => {
        if (!gameState.gameStarted || gameState.gameOver) return

        setGameState(prev => ({
            ...prev,
            projectiles: [...prev.projectiles, {
                x: prev.ship.x + SHIP_SIZE / 2,
                y: prev.ship.y
            }]
        }))
    }, [gameState.gameStarted, gameState.gameOver])

    // Função para desenhar a nave
    const drawShip = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "#4CAF50" // Verde para a nave
        ctx.beginPath()
        ctx.moveTo(x + SHIP_SIZE / 2, y)
        ctx.lineTo(x + SHIP_SIZE, y + SHIP_SIZE)
        ctx.lineTo(x, y + SHIP_SIZE)
        ctx.closePath()
        ctx.fill()
    }, [])

    // Função para desenhar um alien
    const drawAlien = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "#FF4081" // Rosa para os aliens
        ctx.fillRect(x, y, ALIEN_SIZE, ALIEN_SIZE)

        // Olhos do alien
        ctx.fillStyle = "#FFF"
        ctx.fillRect(x + 5, y + 8, 5, 5)
        ctx.fillRect(x + 20, y + 8, 5, 5)

        // Boca do alien
        ctx.fillStyle = "#FFF"
        ctx.fillRect(x + 8, y + 20, 14, 3)
    }, [])

    // Função para desenhar um projétil
    const drawProjectile = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
        ctx.fillStyle = "#FFF" // Branco para os projéteis
        ctx.fillRect(x - PROJECTILE_SIZE / 2, y - PROJECTILE_SIZE, PROJECTILE_SIZE, PROJECTILE_SIZE * 2)
    }, [])

    // Função principal de renderização
    const render = useCallback(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        // Limpar o canvas
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        // Desenhar estrelas (fundo)
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * CANVAS_WIDTH
            const y = Math.random() * CANVAS_HEIGHT
            ctx.fillStyle = "#FFF"
            ctx.fillRect(x, y, 1, 1)
        }

        // Desenhar nave
        drawShip(ctx, gameState.ship.x, gameState.ship.y)

        // Desenhar aliens
        gameState.aliens.forEach(alien => {
            if (alien.alive) {
                drawAlien(ctx, alien.x, alien.y)
            }
        })

        // Desenhar projéteis
        gameState.projectiles.forEach(projectile => {
            drawProjectile(ctx, projectile.x, projectile.y)
        })

        // Desenhar pontuação
        ctx.fillStyle = "#FFF"
        ctx.font = "20px Arial"
        ctx.fillText(`Pontuação: ${gameState.score}`, 10, 30)

        if (gameState.gameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
            ctx.fillStyle = "#FF4081"
            ctx.font = "48px Arial"
            ctx.textAlign = "center"
            ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
            ctx.font = "24px Arial"
            ctx.fillText(`Pontuação Final: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
        }
    }, [gameState, drawShip, drawAlien, drawProjectile])

    useEffect(() => {
        if (!gameState.gameStarted || gameState.gameOver) return

        const gameLoop = setInterval(() => {
            setGameState(prev => {
                // Mover projéteis
                const updatedProjectiles = prev.projectiles
                    .map(p => ({ ...p, y: p.y - PROJECTILE_SPEED }))
                    .filter(p => p.y > 0)

                // Verificar se os aliens devem mudar de direção
                let shouldChangeDirection = false
                let newDirection = prev.aliensDirection

                prev.aliens.forEach(alien => {
                    if (alien.alive) {
                        if (
                            (alien.x >= CANVAS_WIDTH - ALIEN_SIZE && prev.aliensDirection === "right") ||
                            (alien.x <= 0 && prev.aliensDirection === "left")
                        ) {
                            shouldChangeDirection = true
                            newDirection = prev.aliensDirection === "right" ? "left" : "right"
                        }
                    }
                })

                // Mover aliens
                const updatedAliens = prev.aliens.map(alien => {
                    if (!alien.alive) return alien

                    let newX = alien.x
                    if (shouldChangeDirection) {
                        newX = alien.x
                    } else {
                        newX = prev.aliensDirection === "right"
                            ? alien.x + ALIEN_SPEED
                            : alien.x - ALIEN_SPEED
                    }

                    return {
                        ...alien,
                        x: newX,
                        y: shouldChangeDirection ? alien.y + ALIEN_SIZE : alien.y
                    }
                })

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
                    aliensDirection: shouldChangeDirection ? newDirection : prev.aliensDirection,
                    score: updatedAliens.filter(a => !a.alive).length * 100,
                    gameOver
                }
            })
        }, 1000 / 60)

        return () => clearInterval(gameLoop)
    }, [gameState.gameStarted, gameState.gameOver])

    // Loop de renderização usando requestAnimationFrame
    useEffect(() => {
        let animationFrameId: number

        const animate = () => {
            render()
            animationFrameId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [render])

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
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border border-gray-300 bg-black"
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            />

            <div className="flex gap-4 mt-4">
                <Button
                    onClick={() => moveShip("left")}
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
                    onClick={() => moveShip("right")}
                    disabled={!gameState.gameStarted || gameState.gameOver}
                >
                    Direita ➡️
                </Button>
            </div>
        </div>
    )
} 