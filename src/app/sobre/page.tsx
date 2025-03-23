import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Sobre Nós</h1>
                <p className="text-muted-foreground">Conheça mais sobre o projeto AI Games</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Nossa Missão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        O AI Games nasceu da paixão por jogos clássicos e tecnologia moderna. Nossa missão é trazer de volta os jogos que marcaram época, mas com uma roupagem contemporânea e acessível a todos.
                    </p>
                    <p>
                        Acreditamos que os jogos clássicos têm um valor atemporal, não apenas como entretenimento, mas como parte importante da história da computação e do desenvolvimento de software.
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Tecnologia e Inovação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        Utilizamos as mais modernas tecnologias web para recriar esses clássicos:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Next.js 15 para uma experiência web rápida e responsiva</li>
                        <li>TypeScript para código seguro e manutenível</li>
                        <li>Design moderno com Tailwind CSS e shadcn/ui</li>
                        <li>Suporte a temas claro e escuro</li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Nossos Valores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="list-disc pl-6 space-y-2">
                        <li>
                            <strong>Acessibilidade:</strong> Jogos adaptados para diferentes dispositivos e necessidades
                        </li>
                        <li>
                            <strong>Qualidade:</strong> Código limpo e bem estruturado
                        </li>
                        <li>
                            <strong>Comunidade:</strong> Projeto open source e aberto a contribuições
                        </li>
                        <li>
                            <strong>Educação:</strong> Documentação clara e código fonte como recurso de aprendizado
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contribua</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        O AI Games é um projeto open source e adoramos receber contribuições da comunidade! Se você é desenvolvedor e quer participar:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Visite nosso repositório no GitHub</li>
                        <li>Leia nosso guia de contribuição</li>
                        <li>Escolha uma issue para trabalhar</li>
                        <li>Envie seu pull request</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}