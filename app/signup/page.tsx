"use client"
import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import VetraV from "../../public/assets/Vetra-V.jpg"
import VetraLogo from "../../public/assets/Vetra-Logo.png"
import "./Signup.css"

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

    // Validation functions
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const validatePassword = (password: string) => {
        return password.length >= 8
    }

    // Common error handling
    const handleError = (err: any, defaultMessage: string) => {
        console.error(defaultMessage, err)
        setError(err?.errors?.[0]?.message || defaultMessage)
        setLoading(false)
    }

    // Social signup method with shared logic
    const handleSocialSignUp = async (strategy: 'oauth_google' | 'oauth_github') => {
        if (!isLoaded) return

        try {
            setLoading(true)
            setError("")

            await signUp.authenticateWithRedirect({
                strategy,
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/grid`,
            })
        } catch (err: any) {
            handleError(err, `Failed to sign up with ${strategy === 'oauth_google' ? 'Google' : 'GitHub'}`)
        }
    }

    // Email signup method
    async function submit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return

        // Input validation
        if (!validateEmail(emailAddress)) {
            setError("Please enter a valid email address")
            return
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long")
            return
        }

        try {
            setLoading(true)
            setError("")

            await signUp.create({ emailAddress, password })
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })

            setPendingVerification(true)
        } catch (err: any) {
            handleError(err, "Failed to sign up")
        } finally {
            setLoading(false)
        }
    }

    // Email verification method
    async function onPressVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return

        try {
            setLoading(true)
            setError("")

            const completeSignUp = await signUp.attemptEmailAddressVerification({ code })

            if (completeSignUp.status !== "complete") {
                throw new Error("Failed to verify email")
            }

            router.push("/grid")
        } catch (err: any) {
            handleError(err, "Failed to verify email")
        }
    }

    // Render loading spinner
    const LoadingSpinner = () => (
        <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>{pendingVerification ? "Verifying..." : "Creating Account..."}</span>
        </div>
    )

    return (
        <div id="sign-in-container">
      <div id="video-container">
        <div id="video-content">
          <video src="https://res.cloudinary.com/dwkbeovcw/video/upload/v1737741369/Sign-in_Video_urvjww.mp4" autoPlay muted loop></video>
        </div>
      </div>

            <div id="auth-container">
                <Image src={VetraLogo} alt="Vetra Logo" width={500} height={500} />
                <div id="auth-box">
                    {!pendingVerification ? (
                        <form onSubmit={submit}>
                            <div id="our-creds">
                                <input
                                    type="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    placeholder="Email"
                                    disabled={loading}
                                    required
                                />
                                <div className="password-input-container">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    id="sign-in-btn"
                                    disabled={loading}
                                >
                                    {loading ? <LoadingSpinner /> : "Create Account"}
                                </button>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <div id="hr-container">
                                <hr />
                                <p>or</p>
                                <hr />
                            </div>

                            <div id="api-creds">
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignUp('oauth_google')}
                                    className="api"
                                    disabled={loading}
                                >
                                    <i className="fa-brands fa-google"></i>
                                    <p>Sign up with Google</p>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignUp('oauth_github')}
                                    className="api"
                                    disabled={loading}
                                >
                                    <i className="fa-brands fa-github"></i>
                                    <p>Sign up with Github</p>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={onPressVerify}>
                            <div id="our-creds">
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    disabled={loading}
                                    required
                                />
                                <button
                                    type="submit"
                                    id="sign-in-btn"
                                    disabled={loading}
                                >
                                    {loading ? <LoadingSpinner /> : "Verify Email"}
                                </button>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                        </form>
                    )}
                </div>

                <p className="create-account">
                    Already have an account?{" "}
                    <Link href="/sign-in" id="create-acc">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
