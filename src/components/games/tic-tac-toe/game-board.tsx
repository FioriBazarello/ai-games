"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Player = "X" | "O"
type BoardState = (Player | null)[]

const winningCombinations = [
    [0, 1, 2], // horizontais
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // verticais
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonais
    [2, 4, 6],
]

export function GameBoard() {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
    const [winner, setWinner] = useState<Player | "EMPATE" | null>(null)

    const checkWinner = (boardState: BoardState): Player | "EMPATE" | null => {
        // Verifica todas as combinações de vitória
        for (const combo of winningCombinations) {
            const [a, b, c] = combo
            if (
                boardState[a] &&
                boardState[a] === boardState[b] &&
                boardState[a] === boardState[c]
            ) {
                return boardState[a] as Player
            }
        }

        // Verifica empate (quando todas as células estão preenchidas)
        if (boardState.every((cell) => cell !== null)) {
            return "EMPATE"
        }

        return null
    }

    const handleMove = (position: number) => {
        if (board[position] || winner) return

        const newBoard = [...board]
        newBoard[position] = currentPlayer
        setBoard(newBoard)

        const gameWinner = checkWinner(newBoard)
        if (gameWinner) {
            setWinner(gameWinner)
        } else {
            setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
        }
    }

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setCurrentPlayer("X")
        setWinner(null)
    }

    const getStatusMessage = () => {
        if (winner === "EMPATE") return "Jogo empatado!"
        if (winner) return `Jogador ${winner} venceu!`
        return `Vez do jogador ${currentPlayer}`
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-4 p-4 max-w-[400px] w-full">
                {board.map((cell, index) => (
                    <Button
                        key={index}
                        variant={cell ? "default" : "outline"}
                        className="h-24 text-3xl font-bold"
                        onClick={() => handleMove(index)}
                        disabled={!!cell || !!winner}
                    >
                        {cell}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium">
                    {getStatusMessage()}
                </p>
                {winner && (
                    <Button
                        onClick={resetGame}
                        variant="outline"
                    >
                        Jogar Novamente
                    </Button>
                )}
            </div>
        </div>
    )
} 