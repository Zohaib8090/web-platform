"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, LogOut, Clapperboard, ListVideo, Upload } from "lucide-react";
import Logo from "./logo";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/context/auth-provider";
import { useAuth as useFirebaseAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useSearch } from "@/context/search-provider";
import React from "react";
import { useToast } from "@/hooks/use-toast";


export default function Header() {
  const { isLoggedIn } = useAuth();
  const auth = useFirebaseAuth();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push("/");
    } catch (error) {
        console.error("Logout error:", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "An error occurred while logging out.",
        });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <nav className="ml-10 hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link
            href="/"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Home
          </Link>
           {isLoggedIn && (
            <Link
              href="/publish"
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              Publish
            </Link>
          )}
          <Link
            href="/watchlist"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            Watchlist
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search titles, genres..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/publish")}>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Publish Video</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/watchlist")}>
                  <ListVideo className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Clapperboard className="mr-2 h-4 w-4" />
                  <span>History</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/login")}>
                Log In
              </Button>
              <Button onClick={() => router.push("/signup")} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
