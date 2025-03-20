import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GamesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="container mx-auto py-6">
            <Button variant="outline" asChild className="mb-6">
                <Link href="/">← Voltar para Home</Link>
            </Button>
            {children}
        </div>
    )
} 