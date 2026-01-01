import { LoginForm } from "@/components/auth-components";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | StreamVerse",
    description: "Log in to your StreamVerse account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
