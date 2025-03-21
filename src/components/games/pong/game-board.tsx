"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

type GameState = {
    playerY: number
    computerY: number
    ballX: number
    ballY: number
    ballSpeedX: number
    ballSpeedY: number
    playerScore: number
    computerScore: number
    isGameOver: boolean
}

const PADDLE_HEIGHT = 100
const PADDLE_WIDTH = 10
const BALL_SIZE = 10
const GAME_HEIGHT = 400
const GAME_WIDTH = 600
const INITIAL_BALL_SPEED = 5
const SPEED_INCREASE = 1.1

export function GameBoard() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [gameState, setGameState] = useState<GameState>({
        playerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        computerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        ballX: GAME_WIDTH / 2,
        ballY: GAME_HEIGHT / 2,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED,
        playerScore: 0,
        computerScore: 0,
        isGameOver: false
    })

    const resetBall = () => {
        return {
            ballX: GAME_WIDTH / 2,
            ballY: GAME_HEIGHT / 2,
            ballSpeedX: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            ballSpeedY: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
        }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
        if (gameState.isGameOver) return

        const moveAmount = 20
        setGameState(prev => ({
            ...prev,
            playerY: Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT,
                e.key === "ArrowUp" || e.key === "w" || e.key === "W"
                    ? prev.playerY - moveAmount
                    : e.key === "ArrowDown" || e.key === "s" || e.key === "S"
                        ? prev.playerY + moveAmount
                        : prev.playerY
            ))
        }))
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [gameState.isGameOver])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext("2d")
        if (!context) return

        const gameLoop = setInterval(() => {
            if (gameState.isGameOver) return

            // Atualiza posição da bola
            let newBallX = gameState.ballX + gameState.ballSpeedX
            let newBallY = gameState.ballY + gameState.ballSpeedY
            let newBallSpeedX = gameState.ballSpeedX
            let newBallSpeedY = gameState.ballSpeedY
            let newPlayerScore = gameState.playerScore
            let newComputerScore = gameState.computerScore
            let gameOver: boolean = gameState.isGameOver

            // Colisão com as paredes superior e inferior
            if (newBallY <= 0 || newBallY >= GAME_HEIGHT - BALL_SIZE) {
                newBallSpeedY *= -1
            }

            // Colisão com as raquetes
            if (newBallX <= PADDLE_WIDTH &&
                newBallY >= gameState.playerY &&
                newBallY <= gameState.playerY + PADDLE_HEIGHT) {
                newBallX = PADDLE_WIDTH
                newBallSpeedX *= -SPEED_INCREASE
                newBallSpeedY *= SPEED_INCREASE
            }

            if (newBallX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
                newBallY >= gameState.computerY &&
                newBallY <= gameState.computerY + PADDLE_HEIGHT) {
                newBallX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE
                newBallSpeedX *= -SPEED_INCREASE
                newBallSpeedY *= SPEED_INCREASE
            }

            // Pontuação
            if (newBallX < 0) {
                newComputerScore++
                if (newComputerScore >= 5) {
                    gameOver = true
                } else {
                    const resetState = resetBall()
                    newBallX = resetState.ballX
                    newBallY = resetState.ballY
                    newBallSpeedX = resetState.ballSpeedX
                    newBallSpeedY = resetState.ballSpeedY
                }
            } else if (newBallX > GAME_WIDTH) {
                newPlayerScore++
                const resetState = resetBall()
                newBallX = resetState.ballX
                newBallY = resetState.ballY
                newBallSpeedX = resetState.ballSpeedX
                newBallSpeedY = resetState.ballSpeedY
            }

            // IA do computador
            const computerSpeed = 5
            const computerCenter = gameState.computerY + PADDLE_HEIGHT / 2
            const ballCenter = newBallY + BALL_SIZE / 2

            let newComputerY = gameState.computerY
            if (computerCenter < ballCenter - 10) {
                newComputerY = Math.min(gameState.computerY + computerSpeed, GAME_HEIGHT - PADDLE_HEIGHT)
            } else if (computerCenter > ballCenter + 10) {
                newComputerY = Math.max(gameState.computerY - computerSpeed, 0)
            }

            setGameState(prev => ({
                ...prev,
                ballX: newBallX,
                ballY: newBallY,
                ballSpeedX: newBallSpeedX,
                ballSpeedY: newBallSpeedY,
                computerY: newComputerY,
                playerScore: newPlayerScore,
                computerScore: newComputerScore,
                isGameOver: gameOver
            }))

            // Renderização
            context.fillStyle = "#000"
            context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

            // Raquete do jogador
            context.fillStyle = "#fff"
            context.fillRect(0, gameState.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)

            // Raquete do computador
            context.fillRect(GAME_WIDTH - PADDLE_WIDTH, gameState.computerY, PADDLE_WIDTH, PADDLE_HEIGHT)

            // Bola
            context.fillRect(gameState.ballX, gameState.ballY, BALL_SIZE, BALL_SIZE)

            // Linha central
            context.setLineDash([5, 15])
            context.beginPath()
            context.moveTo(GAME_WIDTH / 2, 0)
            context.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
            context.strokeStyle = "#fff"
            context.stroke()

            // Placar
            context.font = "32px Arial"
            context.fillText(gameState.playerScore.toString(), GAME_WIDTH / 4, 50)
            context.fillText(gameState.computerScore.toString(), 3 * GAME_WIDTH / 4, 50)

        }, 1000 / 60)

        return () => clearInterval(gameLoop)
    }, [gameState])

    const restartGame = () => {
        const resetState = resetBall()
        setGameState({
            playerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            computerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            ballX: resetState.ballX,
            ballY: resetState.ballY,
            ballSpeedX: resetState.ballSpeedX,
            ballSpeedY: resetState.ballSpeedY,
            playerScore: 0,
            computerScore: 0,
            isGameOver: false
        })
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-between w-full max-w-[600px] px-4">
                <p className="text-lg">Você: {gameState.playerScore}</p>
                <p className="text-lg">Computador: {gameState.computerScore}</p>
            </div>

            <canvas
                ref={canvasRef}
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                className="border border-border rounded-lg"
            />

            {gameState.isGameOver && (
                <div className="text-center">
                    <p className="text-xl font-bold mb-4">
                        Fim de jogo! Sua pontuação: {gameState.playerScore}
                    </p>
                    <Button onClick={restartGame}>Jogar Novamente</Button>
                </div>
            )}
        </div>
    )
} 