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
    const containerRef = useRef<HTMLDivElement>(null)
    const gameStateRef = useRef<GameState>({
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
    const [, forceUpdate] = useState({})

    const resetBall = () => {
        return {
            ballX: GAME_WIDTH / 2,
            ballY: GAME_HEIGHT / 2,
            ballSpeedX: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            ballSpeedY: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
        }
    }

    const handleKeyPress = (e: KeyboardEvent) => {
        if (gameStateRef.current.isGameOver) return

        const moveAmount = 20
        const newPlayerY = Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT,
            e.key === "ArrowUp" || e.key === "w" || e.key === "W"
                ? gameStateRef.current.playerY - moveAmount
                : e.key === "ArrowDown" || e.key === "s" || e.key === "S"
                    ? gameStateRef.current.playerY + moveAmount
                    : gameStateRef.current.playerY
        ))

        gameStateRef.current = {
            ...gameStateRef.current,
            playerY: newPlayerY
        }
        forceUpdate({})
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress)
        return () => window.removeEventListener("keydown", handleKeyPress)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const context = canvas.getContext("2d")
        if (!context) return

        const resizeCanvas = () => {
            const containerWidth = container.clientWidth
            const scale = containerWidth / GAME_WIDTH
            const scaledHeight = GAME_HEIGHT * scale

            canvas.style.width = `${containerWidth}px`
            canvas.style.height = `${scaledHeight}px`
            canvas.width = GAME_WIDTH
            canvas.height = GAME_HEIGHT
        }

        const render = () => {
            context.fillStyle = "#000"
            context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

            context.fillStyle = "#fff"
            context.fillRect(0, gameStateRef.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
            context.fillRect(GAME_WIDTH - PADDLE_WIDTH, gameStateRef.current.computerY, PADDLE_WIDTH, PADDLE_HEIGHT)
            context.fillRect(gameStateRef.current.ballX, gameStateRef.current.ballY, BALL_SIZE, BALL_SIZE)

            context.setLineDash([5, 15])
            context.beginPath()
            context.moveTo(GAME_WIDTH / 2, 0)
            context.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
            context.strokeStyle = "#fff"
            context.stroke()

            context.font = "32px Arial"
            context.fillText(gameStateRef.current.playerScore.toString(), GAME_WIDTH / 4, 50)
            context.fillText(gameStateRef.current.computerScore.toString(), 3 * GAME_WIDTH / 4, 50)
        }

        resizeCanvas()
        window.addEventListener("resize", resizeCanvas)

        const gameLoop = setInterval(() => {
            if (gameStateRef.current.isGameOver) return

            const state = gameStateRef.current
            let newBallX = state.ballX + state.ballSpeedX
            let newBallY = state.ballY + state.ballSpeedY
            let newBallSpeedX = state.ballSpeedX
            let newBallSpeedY = state.ballSpeedY
            let newPlayerScore = state.playerScore
            let newComputerScore = state.computerScore
            let gameOver = state.isGameOver

            if (newBallY <= 0 || newBallY >= GAME_HEIGHT - BALL_SIZE) {
                newBallSpeedY *= -1
            }

            if (newBallX <= PADDLE_WIDTH &&
                newBallY >= state.playerY &&
                newBallY <= state.playerY + PADDLE_HEIGHT) {
                newBallX = PADDLE_WIDTH
                newBallSpeedX *= -SPEED_INCREASE
                newBallSpeedY *= SPEED_INCREASE
            }

            if (newBallX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
                newBallY >= state.computerY &&
                newBallY <= state.computerY + PADDLE_HEIGHT) {
                newBallX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE
                newBallSpeedX *= -SPEED_INCREASE
                newBallSpeedY *= SPEED_INCREASE
            }

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

            const computerSpeed = 5
            const computerCenter = state.computerY + PADDLE_HEIGHT / 2
            const ballCenter = newBallY + BALL_SIZE / 2

            let newComputerY = state.computerY
            if (computerCenter < ballCenter - 10) {
                newComputerY = Math.min(state.computerY + computerSpeed, GAME_HEIGHT - PADDLE_HEIGHT)
            } else if (computerCenter > ballCenter + 10) {
                newComputerY = Math.max(state.computerY - computerSpeed, 0)
            }

            gameStateRef.current = {
                ...state,
                ballX: newBallX,
                ballY: newBallY,
                ballSpeedX: newBallSpeedX,
                ballSpeedY: newBallSpeedY,
                computerY: newComputerY,
                playerScore: newPlayerScore,
                computerScore: newComputerScore,
                isGameOver: gameOver
            }

            forceUpdate({})
            render()
        }, 1000 / 60)

        render()

        return () => {
            clearInterval(gameLoop)
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])

    const restartGame = () => {
        const resetState = resetBall()
        gameStateRef.current = {
            playerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            computerY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            ballX: resetState.ballX,
            ballY: resetState.ballY,
            ballSpeedX: resetState.ballSpeedX,
            ballSpeedY: resetState.ballSpeedY,
            playerScore: 0,
            computerScore: 0,
            isGameOver: false
        }
        forceUpdate({})
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-between w-full max-w-[600px] px-4">
                <p className="text-lg">Você: {gameStateRef.current.playerScore}</p>
                <p className="text-lg">Computador: {gameStateRef.current.computerScore}</p>
            </div>

            <div ref={containerRef} className="w-full max-w-[600px] px-4">
                <canvas
                    ref={canvasRef}
                    width={GAME_WIDTH}
                    height={GAME_HEIGHT}
                    className="border border-border rounded-lg"
                />
            </div>

            {gameStateRef.current.isGameOver && (
                <div className="text-center">
                    <p className="text-xl font-bold mb-4">
                        Fim de jogo! Sua pontuação: {gameStateRef.current.playerScore}
                    </p>
                    <Button onClick={restartGame}>Jogar Novamente</Button>
                </div>
            )}
        </div>
    )
} 