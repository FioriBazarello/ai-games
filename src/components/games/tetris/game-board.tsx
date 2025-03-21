"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"

// Tipos
type TetrisBlock = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | null
type TetrisGrid = TetrisBlock[][]
type TetrisPiece = {
    shape: TetrisBlock[][]
    x: number
    y: number
}

interface GameState {
    grid: TetrisGrid
    currentPiece: TetrisPiece | null
    score: number
    gameOver: boolean
    isPaused: boolean
}

// Peças do Tetris
const TETRIS_PIECES = {
    I: [[null, null, null, null],
    ['I', 'I', 'I', 'I'],
    [null, null, null, null],
    [null, null, null, null]],
    O: [['O', 'O'],
    ['O', 'O']],
    T: [[null, 'T', null],
    ['T', 'T', 'T'],
    [null, null, null]],
    S: [[null, 'S', 'S'],
    ['S', 'S', null],
    [null, null, null]],
    Z: [['Z', 'Z', null],
    [null, 'Z', 'Z'],
    [null, null, null]],
    J: [['J', null, null],
    ['J', 'J', 'J'],
    [null, null, null]],
    L: [[null, null, 'L'],
    ['L', 'L', 'L'],
    [null, null, null]]
}

const GRID_WIDTH = 10
const GRID_HEIGHT = 20
const INITIAL_SPEED = 1000

export function GameBoard() {
    const [gameState, setGameState] = useState<GameState>({
        grid: Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)),
        currentPiece: null,
        score: 0,
        gameOver: false,
        isPaused: false
    })

    // Criar nova peça
    const createNewPiece = useCallback(() => {
        const pieces = Object.keys(TETRIS_PIECES) as (keyof typeof TETRIS_PIECES)[]
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
        return {
            shape: TETRIS_PIECES[randomPiece],
            x: Math.floor(GRID_WIDTH / 2) - Math.floor(TETRIS_PIECES[randomPiece][0].length / 2),
            y: 0
        }
    }, [])

    // Verificar colisão
    const checkCollision = useCallback((piece: TetrisPiece, grid: TetrisGrid) => {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newX = piece.x + x
                    const newY = piece.y + y

                    if (newX < 0 || newX >= GRID_WIDTH ||
                        newY >= GRID_HEIGHT ||
                        (newY >= 0 && grid[newY][newX])) {
                        return true
                    }
                }
            }
        }
        return false
    }, [])

    // Mover peça
    const movePiece = useCallback((dx: number, dy: number) => {
        if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return

        const newPiece = {
            ...gameState.currentPiece,
            x: gameState.currentPiece.x + dx,
            y: gameState.currentPiece.y + dy
        }

        if (!checkCollision(newPiece, gameState.grid)) {
            setGameState(prev => ({
                ...prev,
                currentPiece: newPiece
            }))
        } else if (dy > 0) {
            // Colisão ao mover para baixo - fixar peça
            const newGrid = [...gameState.grid]
            const piece = gameState.currentPiece

            // Adicionar peça ao grid
            for (let y = 0; y < piece.shape.length; y++) {
                for (let x = 0; x < piece.shape[y].length; x++) {
                    if (piece.shape[y][x]) {
                        const newY = piece.y + y
                        if (newY < 0) {
                            setGameState(prev => ({ ...prev, gameOver: true }))
                            return
                        }
                        newGrid[newY][piece.x + x] = piece.shape[y][x]
                    }
                }
            }

            // Verificar linhas completas
            let linesCleared = 0
            for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                if (newGrid[y].every(cell => cell !== null)) {
                    newGrid.splice(y, 1)
                    newGrid.unshift(Array(GRID_WIDTH).fill(null))
                    linesCleared++
                    y++
                }
            }

            // Atualizar estado
            setGameState(prev => ({
                ...prev,
                grid: newGrid,
                currentPiece: createNewPiece(),
                score: prev.score + (linesCleared * 100)
            }))
        }
    }, [gameState, checkCollision, createNewPiece])

    // Rotacionar peça
    const rotatePiece = useCallback(() => {
        if (gameState.gameOver || gameState.isPaused || !gameState.currentPiece) return

        const piece = gameState.currentPiece
        const newShape = piece.shape[0].map((_, i) =>
            piece.shape.map(row => row[row.length - 1 - i])
        ) as TetrisBlock[][]

        const newPiece = {
            ...piece,
            shape: newShape
        }

        if (!checkCollision(newPiece, gameState.grid)) {
            setGameState(prev => ({
                ...prev,
                currentPiece: newPiece
            }))
        }
    }, [gameState, checkCollision])

    // Controles do teclado
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (gameState.gameOver) return

            switch (e.key) {
                case 'ArrowLeft':
                    movePiece(-1, 0)
                    break
                case 'ArrowRight':
                    movePiece(1, 0)
                    break
                case 'ArrowDown':
                    movePiece(0, 1)
                    break
                case 'ArrowUp':
                    rotatePiece()
                    break
                case ' ':
                    // Queda instantânea
                    while (!checkCollision({ ...gameState.currentPiece!, y: gameState.currentPiece!.y + 1 }, gameState.grid)) {
                        movePiece(0, 1)
                    }
                    break
                case 'p':
                    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
                    break
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameState, movePiece, rotatePiece, checkCollision])

    // Game loop
    useEffect(() => {
        if (!gameState.currentPiece) {
            setGameState(prev => ({
                ...prev,
                currentPiece: createNewPiece()
            }))
        }

        const gameLoop = setInterval(() => {
            if (!gameState.gameOver && !gameState.isPaused) {
                movePiece(0, 1)
            }
        }, INITIAL_SPEED)

        return () => clearInterval(gameLoop)
    }, [gameState, createNewPiece, movePiece])

    // Renderizar grid
    const renderGrid = () => {
        const displayGrid = [...gameState.grid]

        // Adicionar peça atual ao grid de exibição
        if (gameState.currentPiece) {
            const { shape, x, y } = gameState.currentPiece
            shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell && y + dy >= 0) {
                        if (y + dy < GRID_HEIGHT && x + dx >= 0 && x + dx < GRID_WIDTH) {
                            displayGrid[y + dy][x + dx] = cell
                        }
                    }
                })
            })
        }

        return (
            <div className="grid grid-cols-10 gap-px bg-gray-700 p-2 rounded-lg">
                {displayGrid.flat().map((cell, i) => (
                    <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${cell ? 'bg-blue-500' : 'bg-gray-900'
                            }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-6">
            {renderGrid()}

            <div className="flex gap-4 items-center">
                <div className="text-lg font-bold">
                    Pontuação: {gameState.score}
                </div>

                {gameState.gameOver ? (
                    <Button
                        onClick={() => setGameState({
                            grid: Array(GRID_HEIGHT).fill(null).map(() => Array(GRID_WIDTH).fill(null)),
                            currentPiece: createNewPiece(),
                            score: 0,
                            gameOver: false,
                            isPaused: false
                        })}
                    >
                        Novo Jogo
                    </Button>
                ) : (
                    <Button
                        onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                    >
                        {gameState.isPaused ? 'Continuar' : 'Pausar'}
                    </Button>
                )}
            </div>
        </div>
    )
} 