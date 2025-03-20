import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Games",
  description: "Uma coleção de mini jogos feitos com Next.js e shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">
              <div className="container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
                {children}
              </div>
            </main>
            <footer className="border-t py-6 md:py-0">
              <div className="container flex h-14 items-center justify-between px-4 md:px-6 lg:px-8">
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} AI Games. Todos os direitos reservados.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
