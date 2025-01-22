"use client"
import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Eye, EyeOff, Github } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

function SignUp() {
    const { isLoaded, signUp } = useSignUp()
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("")
    const [pendingVerification, setPendingVerification] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    if (!isLoaded) {
        return null
    }

    const handleGoogleSignUp = async () => {
        try {
            setLoading(true);
            setError("");

            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/grid`,
            });
        } catch (err: any) {
            console.error("Google signup error:", err);
            setError(err?.errors?.[0]?.message || "Failed to sign up with Google. Please try again.");
            setLoading(false);
        }
    };

    const handleGithubSignUp = async () => {
        try {
            setLoading(true);
            setError("");

            await signUp.authenticateWithRedirect({
                strategy: "oauth_github",
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/dashboard`,
            });
        } catch (err: any) {
            console.error("GitHub signup error:", err);
            setError(err?.errors?.[0]?.message || "Failed to sign up with GitHub. Please try again.");
            setLoading(false);
        }
    };

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return

        try {
            setLoading(true)
            setError("")

            await signUp.create({
                emailAddress,
                password
            })

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code"
            })

            setPendingVerification(true)
        } catch (err: any) {
            console.error("Email signup error:", err)
            setError(err?.errors?.[0]?.message || "Failed to sign up. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    async function onPressVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return

        try {
            setLoading(true)
            setError("")

            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code
            })

            if (completeSignUp.status !== "complete") {
                throw new Error("Failed to verify email")
            }

            router.push("/dashboard")

        } catch (err: any) {
            console.error("Verification error:", err)
            setError(err?.errors?.[0]?.message || "Failed to verify email. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Sign Up for Todo Master
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Button
                            onClick={handleGoogleSignUp}
                            className="w-full"
                            variant="outline"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center gap-2">
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
                                {loading ? "Loading..." : "Continue with Google"}
                            </div>
                        </Button>

                        <Button
                            onClick={handleGithubSignUp}
                            className="w-full"
                            variant="outline"
                            disabled={loading}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Github className="w-5 h-5" />
                                {loading ? "Loading..." : "Continue with GitHub"}
                            </div>
                        </Button>
                    </div>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {!pendingVerification ? (
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    disabled={loading}
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
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2"
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Loading..." : "Sign Up"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={onPressVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Verification Code</Label>
                                <Input
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    disabled={loading}
                                    required
                                />
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Loading..." : "Verify Email"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUp