"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SignIn() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    if (!isLoaded) {
        return null;
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/grid",
            });
        } catch (err: any) {
            console.error("Google sign-in error:", err);
            setError("An error occurred during Google sign-in. Please try again.");
        }
    };

    const handleGithubSignIn = async () => {
        try {
            const result = await signIn.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            });
        } catch (err: any) {
            console.error("GitHub sign-in error:", err);
            setError("An error occurred during GitHub sign-in. Please try again.");
        }
    };

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!signIn || !setActive) {
            setError(
                "Sign-in functionality is not available at the moment. Please try again later."
            );
            return;
        }

        try {
            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                console.log("Sign-in successful, setting session...");
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                console.error("Unexpected response from Clerk:", result);
                setError("Unexpected error during sign-in. Please try again.");
            }
        } catch (err: any) {
            console.error("Sign-in error: Raw error object:", err);

            if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
                setError(err.errors[0]?.message || "An error occurred during sign-in.");
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Sign In to Todo Master
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                        >
                            <svg viewBox="0 0 48 48" className="w-5 h-5">
                                <path
                                    fill="#FFC107"
                                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGithubSignIn}
                        >
                            <Github className="w-5 h-5 mr-2" />
                            Continue with GitHub
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                                <div className="text-sm text-right">
                                    <Link
                                        href="/forgot-password"
                                        className="text-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full">
                            Sign In with Email
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}