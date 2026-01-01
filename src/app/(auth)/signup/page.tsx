import { SignupForm } from "@/components/auth-components";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | StreamVerse",
    description: "Create a new StreamVerse account.",
};

export default function SignupPage() {
  return <SignupForm />;
}
