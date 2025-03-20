"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

type Card = {
    id: number
    emoji: string
    isFlipped: boolean
    isMatched: boolean
}

const emojis = ["🎮", "🎲", "🎯", "🎪", "🎨", "🎭", "🎪", "🎯", "🎲", "🎮", "🎨", "🎭"]

export function GameBoard() {
    const [cards, setCards] = useState<Card[]>([])
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [moves, setMoves] = useState(0)
    const [matches, setMatches] = useState(0)
    const [isChecking, setIsChecking] = useState(false)

    const initializeGame = () => {
        const shuffledCards = [...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false,
            }))
        setCards(shuffledCards)
        setFlippedCards([])
        setMoves(0)
        setMatches(0)
        setIsChecking(false)
    }

    useEffect(() => {
        initializeGame()
    }, [])

    const handleCardClick = (cardId: number) => {
        if (
            isChecking ||
            flippedCards.includes(cardId) ||
            cards[cardId].isMatched ||
            flippedCards.length >= 2
        ) {
            return
        }

        const newFlippedCards = [...flippedCards, cardId]
        setFlippedCards(newFlippedCards)

        if (newFlippedCards.length === 2) {
            setIsChecking(true)
            setMoves(prev => prev + 1)

            const [firstCard, secondCard] = newFlippedCards
            const isMatch = cards[firstCard].emoji === cards[secondCard].emoji

            setTimeout(() => {
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === firstCard || card.id === secondCard
                            ? { ...card, isFlipped: false, isMatched: isMatch }
                            : card
                    )
                )
                setFlippedCards([])
                setIsChecking(false)
                if (isMatch) {
                    setMatches(prev => prev + 1)
                }
            }, 1000)
        }

        setCards(prevCards =>
            prevCards.map(card =>
                card.id === cardId ? { ...card, isFlipped: true } : card
            )
        )
    }

    const isGameComplete = matches === emojis.length / 2

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex justify-between w-full max-w-[600px] px-4">
                <p className="text-lg">Movimentos: {moves}</p>
                <p className="text-lg">Pares: {matches}/{emojis.length / 2}</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 p-4 w-full max-w-[600px]">
                {cards.map(card => (
                    <Button
                        key={card.id}
                        variant={card.isMatched ? "default" : "outline"}
                        className={`aspect-square text-3xl transition-all duration-300 ${(card.isFlipped || card.isMatched) ? "rotate-0" : "rotate-180"
                            }`}
                        onClick={() => handleCardClick(card.id)}
                        disabled={isChecking || card.isMatched}
                    >
                        {card.isFlipped || card.isMatched ? card.emoji : "❓"}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col items-center gap-4">
                {isChecking && (
                    <Loader2 className="h-6 w-6 animate-spin" />
                )}
                {isGameComplete && (
                    <div className="text-center">
                        <p className="text-xl font-bold mb-4">
                            Parabéns! Você completou o jogo em {moves} movimentos!
                        </p>
                        <Button onClick={initializeGame}>Jogar Novamente</Button>
                    </div>
                )}
            </div>
        </div>
    )
} 