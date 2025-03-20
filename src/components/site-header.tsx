"use client"

import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                <Link
                    href="/"
                    className="flex items-center gap-2 transition-colors hover:opacity-90"
                >
                    <span className="hidden font-bold sm:inline-block text-xl">🎮 AI Games</span>
                    <span className="font-bold sm:hidden text-xl">🎮</span>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={toggleTheme}
                >
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Alternar tema</span>
                </Button>
            </div>
        </header>
    )
} 