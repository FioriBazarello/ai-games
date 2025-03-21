import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const games = [
  {
    id: 1,
    title: "Jogo da Velha",
    description: "O clássico jogo da velha com uma interface moderna",
    image: "/games/tic-tac-toe.png",
    route: "/games/tic-tac-toe"
  },
  {
    id: 2,
    title: "Jogo da Memória",
    description: "Teste sua memória encontrando os pares de cartas",
    image: "/games/memory.png",
    route: "/games/memory"
  },
  {
    id: 3,
    title: "Snake Game",
    description: "O famoso jogo da cobrinha em uma versão moderna",
    image: "/games/snake.png",
    route: "/games/snake"
  },
  {
    id: 4,
    title: "Pong",
    description: "O clássico jogo de tênis de mesa contra o computador",
    image: "/games/pong.png",
    route: "/games/pong"
  }
]

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center text-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Bem-vindo ao AI Games
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          Uma coleção de jogos clássicos recriados com uma interface moderna.
          Escolha seu jogo favorito e divirta-se!
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-muted-foreground/5 to-muted-foreground/30" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <a href={game.route}>Jogar Agora</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  )
}
