"use client";

import React, { ReactNode } from "react";
import { useUser, FirebaseClientProvider } from "@/firebase";

interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function AuthProviderInternal({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return null; // Or a loading spinner
  }

  const value = { isLoggedIn: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthProviderInternal>{children}</AuthProviderInternal>
    </FirebaseClientProvider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
