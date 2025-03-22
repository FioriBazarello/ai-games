"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

type Position = {
    x: number
    y: number
}

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

const GRID_SIZE = 20
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION: Direction = "RIGHT"
const GAME_SPEED = 150

export function GameBoard() {
    const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
    const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
    const [food, setFood] = useState<Position>({ x: 15, y: 10 })
    const [isGameOver, setIsGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    const generateFood = useCallback(() => {
        let newFood: Position
        do {
            newFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
            }
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
        setFood(newFood)
    }, [snake])

    const resetGame = () => {
        setSnake(INITIAL_SNAKE)
        setDirection(INITIAL_DIRECTION)
        setIsGameOver(false)
        setScore(0)
        generateFood()
        setIsPlaying(true)
    }

    const checkCollision = (head: Position): boolean => {
        // Colisão com as paredes
        if (
            head.x < 0 ||
            head.x >= GRID_SIZE ||
            head.y < 0 ||
            head.y >= GRID_SIZE
        ) {
            return true
        }

        // Colisão com o próprio corpo
        return snake.some(segment => segment.x === head.x && segment.y === head.y)
    }

    const moveSnake = useCallback(() => {
        if (!isPlaying || isGameOver) return

        const head = snake[0]
        const newHead: Position = { ...head }

        switch (direction) {
            case "UP":
                newHead.y -= 1
                break
            case "DOWN":
                newHead.y += 1
                break
            case "LEFT":
                newHead.x -= 1
                break
            case "RIGHT":
                newHead.x += 1
                break
        }

        if (checkCollision(newHead)) {
            setIsGameOver(true)
            setIsPlaying(false)
            if (score > highScore) {
                setHighScore(score)
            }
            return
        }

        const newSnake = [newHead]
        const didEatFood = newHead.x === food.x && newHead.y === food.y

        if (didEatFood) {
            setScore(prev => prev + 1)
            generateFood()
            newSnake.push(...snake)
        } else {
            newSnake.push(...snake.slice(0, -1))
        }

        setSnake(newSnake)
    }, [direction, snake, food, isGameOver, isPlaying, score, highScore, generateFood])

    const handleKeyPress = useCallback((event: KeyboardEvent) => {
        if (isGameOver) return;

        switch (event.key) {
            case "ArrowUp":
                if (direction !== "DOWN") setDirection("UP");
                break;
            case "ArrowDown":
                if (direction !== "UP") setDirection("DOWN");
                break;
            case "ArrowLeft":
                if (direction !== "RIGHT") setDirection("LEFT");
                break;
            case "ArrowRight":
                if (direction !== "LEFT") setDirection("RIGHT");
                break;
        }
    }, [direction, isGameOver, checkCollision])

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [handleKeyPress])

    useEffect(() => {
        const gameLoop = setInterval(moveSnake, GAME_SPEED)
        return () => clearInterval(gameLoop)
    }, [moveSnake])

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-between w-full max-w-[600px] px-4">
                <p className="text-lg">Pontuação: {score}</p>
                <p className="text-lg">Recorde: {highScore}</p>
            </div>

            <div className="relative aspect-square w-full max-w-[600px] bg-muted rounded-lg p-4">
                <div className="relative w-full h-full border-2 border-border rounded-md overflow-hidden">
                    {/* Grid do jogo */}
                    <div className="absolute inset-0 grid"
                        style={{
                            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
                        }}
                    >
                        {/* Cobra */}
                        {snake.map((segment, index) => (
                            <div
                                key={index}
                                className="bg-primary rounded-sm"
                                style={{
                                    gridColumn: segment.x + 1,
                                    gridRow: segment.y + 1,
                                }}
                            />
                        ))}
                        {/* Comida */}
                        <div
                            className="bg-red-500 rounded-full"
                            style={{
                                gridColumn: food.x + 1,
                                gridRow: food.y + 1,
                            }}
                        />
                    </div>
                </div>

                {/* Overlay de Game Over ou Início */}
                {(!isPlaying || isGameOver) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
                        <div className="text-center space-y-4 p-4">
                            {isGameOver ? (
                                <>
                                    <p className="text-2xl font-bold">Game Over!</p>
                                    <p className="text-lg">Pontuação: {score}</p>
                                    {score === highScore && score > 0 && (
                                        <p className="text-lg text-primary">Novo Recorde!</p>
                                    )}
                                </>
                            ) : (
                                <p className="text-2xl">Pronto para começar?</p>
                            )}
                            <Button onClick={resetGame}>
                                {isGameOver ? "Jogar Novamente" : "Iniciar Jogo"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Controles para Mobile */}
            <div className="md:hidden">
                <div className="grid grid-cols-3 gap-2 max-w-[200px]">
                    <div />
                    <Button
                        variant="outline"
                        onClick={() => isPlaying && setDirection("UP")}
                        disabled={!isPlaying}
                    >
                        W
                    </Button>
                    <div />
                    <Button
                        variant="outline"
                        onClick={() => isPlaying && setDirection("LEFT")}
                        disabled={!isPlaying}
                    >
                        A
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => isPlaying && setDirection("DOWN")}
                        disabled={!isPlaying}
                    >
                        S
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => isPlaying && setDirection("RIGHT")}
                        disabled={!isPlaying}
                    >
                        D
                    </Button>
                </div>
            </div>
        </div>
    )
} 