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
    width: number
    height: number
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
    level: number
    alienSpeed: number
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
        aliensDirection: "right",
        level: 1,
        alienSpeed: 2
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
                    direction: "right",
                    width: 40,
                    height: 40
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

        // Adicionar informações do nível
        ctx.fillStyle = 'white'
        ctx.font = '20px Arial'
        ctx.fillText(`Nível: ${gameState.level}`, 10, 60)

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

    const initializeAliens = useCallback((level: number) => {
        const rows = Math.min(3 + Math.floor(level / 2), 6)
        const cols = Math.min(6 + Math.floor(level / 2), 10)
        const aliens: Alien[] = []
        const spacing = 60
        const startX = (CANVAS_WIDTH - (cols * spacing)) / 2
        const startY = 50

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                aliens.push({
                    x: startX + col * spacing,
                    y: startY + row * spacing,
                    width: 40,
                    height: 40,
                    alive: true,
                    direction: "right"
                })
            }
        }
        return aliens
    }, [])

    const checkLevelComplete = useCallback(() => {
        if (gameState.aliens.every(alien => !alien.alive)) {
            const newLevel = gameState.level + 1
            const newAlienSpeed = Math.min(gameState.alienSpeed + 0.5, 8)

            setGameState(prev => ({
                ...prev,
                level: newLevel,
                alienSpeed: newAlienSpeed,
                aliens: initializeAliens(newLevel),
                gameStarted: true,
                gameOver: false,
            }))
        }
    }, [gameState.aliens, gameState.level, gameState.alienSpeed, initializeAliens])

    const checkCollisions = useCallback(() => {
        const updatedAliens = [...gameState.aliens];
        const updatedProjectiles = gameState.projectiles.filter(projectile => {
            let hitAlien = false;

            updatedAliens.forEach(alien => {
                if (alien.alive &&
                    projectile.x > alien.x &&
                    projectile.x < alien.x + alien.width &&
                    projectile.y > alien.y &&
                    projectile.y < alien.y + alien.height) {
                    alien.alive = false;
                    hitAlien = true;
                }
            });

            return !hitAlien && projectile.y > 0;
        });

        // Verificar game over
        const gameOver = updatedAliens.some(alien =>
            alien.alive && alien.y + alien.height >= gameState.ship.y);

        setGameState(prev => ({
            ...prev,
            aliens: updatedAliens,
            projectiles: updatedProjectiles,
            score: updatedAliens.filter(a => !a.alive).length * 100,
            gameOver
        }));
    }, [gameState.aliens, gameState.projectiles, gameState.ship.y]);

    useEffect(() => {
        if (!canvasRef.current || !gameState.gameStarted || gameState.gameOver) return;

        const gameLoop = () => {
            setGameState(prev => {
                // Atualizar posição dos projéteis
                const updatedProjectiles = prev.projectiles
                    .map(projectile => ({
                        ...projectile,
                        y: projectile.y - PROJECTILE_SPEED
                    }))
                    .filter(projectile => projectile.y > 0);

                // Atualizar posição dos aliens
                let shouldChangeDirection = false;
                let shouldMoveDown = false;

                // Verificar se algum alien atingiu as bordas
                prev.aliens.forEach(alien => {
                    if (alien.alive) {
                        const nextX = alien.direction === "right"
                            ? alien.x + prev.alienSpeed
                            : alien.x - prev.alienSpeed;

                        if (nextX <= 0 || nextX >= CANVAS_WIDTH - ALIEN_SIZE) {
                            shouldChangeDirection = true;
                            shouldMoveDown = true;
                        }
                    }
                });

                // Atualizar aliens
                const updatedAliens = prev.aliens.map(alien => {
                    if (!alien.alive) return alien;

                    let newX = alien.x;
                    let newY = alien.y;
                    const newDirection = shouldChangeDirection
                        ? (alien.direction === "right" ? "left" : "right")
                        : alien.direction;

                    if (!shouldChangeDirection) {
                        newX = newDirection === "right"
                            ? alien.x + prev.alienSpeed
                            : alien.x - prev.alienSpeed;
                    }

                    if (shouldMoveDown) {
                        newY = alien.y + 30;
                    }

                    return {
                        ...alien,
                        x: newX,
                        y: newY,
                        direction: newDirection
                    };
                });

                // Verificar colisões
                const aliensAfterCollisions = [...updatedAliens];
                const projectilesAfterCollisions = updatedProjectiles.filter(projectile => {
                    let hitAlien = false;
                    aliensAfterCollisions.forEach(alien => {
                        if (alien.alive &&
                            projectile.x > alien.x &&
                            projectile.x < alien.x + alien.width &&
                            projectile.y > alien.y &&
                            projectile.y < alien.y + alien.height) {
                            alien.alive = false;
                            hitAlien = true;
                        }
                    });
                    return !hitAlien;
                });

                // Verificar game over
                const gameOver = aliensAfterCollisions.some(alien =>
                    alien.alive && alien.y + alien.height >= prev.ship.y);

                // Verificar se o nível foi completado
                const allAliensDestroyed = aliensAfterCollisions.every(alien => !alien.alive);
                if (allAliensDestroyed) {
                    const newLevel = prev.level + 1;
                    const newAlienSpeed = Math.min(prev.alienSpeed + 0.5, 8);
                    return {
                        ...prev,
                        level: newLevel,
                        alienSpeed: newAlienSpeed,
                        aliens: initializeAliens(newLevel),
                        projectiles: [],
                        score: prev.score
                    };
                }

                return {
                    ...prev,
                    aliens: aliensAfterCollisions,
                    projectiles: projectilesAfterCollisions,
                    score: (prev.aliens.filter(a => !a.alive).length) * 100,
                    gameOver
                };
            });
        };

        const gameInterval = setInterval(gameLoop, 1000 / 60);
        return () => clearInterval(gameInterval);
    }, [gameState.gameStarted, gameState.gameOver, initializeAliens]);

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

    useEffect(() => {
        // Inicializar aliens com o nível atual quando o jogo começa
        setGameState(prev => ({
            ...prev,
            aliens: initializeAliens(prev.level),
        }))
    }, [initializeAliens])

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