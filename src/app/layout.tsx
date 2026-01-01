import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-provider";
import { WatchlistProvider } from "@/context/watchlist-provider";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-provider";

export const metadata: Metadata = {
  title: "StreamVerse",
  description: "Your universe of streaming.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <SearchProvider>
          <AuthProvider>
            <WatchlistProvider>
              <div className="relative flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster />
            </WatchlistProvider>
          </AuthProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
