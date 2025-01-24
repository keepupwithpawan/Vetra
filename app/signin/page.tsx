"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import VetraV from "../../public/assets/Vetra-V.jpg";
import VetraLogo from "../../public/assets/Vetra-Logo.png";
import "./SignIn.css";

export default function SignIn() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!isLoaded) {
        return null;
    }

    const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_github", provider: string) => {
        try {
            setIsLoading(true);
            setError("");

            // First attempt to verify if user exists using email/password sign-in
            try {
                const verification = await signIn.create({
                    strategy: "oauth_" + provider,
                    identifier: "",
                });

                // If we get here, user doesn't exist
                setError(`No account found. Please sign up first.`);
                setTimeout(() => {
                    router.push("/sign-up");
                }, 2000);
                return;

            } catch (verificationErr: any) {
                // If we get a specific error about the user not existing
                if (verificationErr.errors?.[0]?.code === "form_identifier_not_found") {
                    setError(`No account found. Please sign up first.`);
                    setTimeout(() => {
                        router.push("/sign-up");
                    }, 2000);
                    return;
                }
                
                // If we get here, attempt the OAuth flow
                await signIn.authenticateWithRedirect({
                    strategy,
                    redirectUrl: `${window.location.origin}/sso-callback`,
                    redirectUrlComplete: `${window.location.origin}/grid`,
                });
            }

        } catch (err: any) {
            console.error(`${provider} sign-in error:`, err);
            setError(`An error occurred during ${provider} sign-in. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => handleOAuthSignIn("oauth_google", "google");
    const handleGithubSignIn = () => handleOAuthSignIn("oauth_github", "github");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        
        if (!signIn || !setActive) {
            setError("Sign-in functionality is not available at the moment. Please try again later.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const result = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/grid");
            } else {
                console.error("Unexpected response from Clerk:", result);
                setError("Failed to sign in. Please check your credentials.");
            }
        } catch (err: any) {
            console.error("Sign-in error:", err);
            
            if (err.errors?.[0]?.code === "form_identifier_not_found") {
                setError("No account found with this email. Please sign up first.");
                setTimeout(() => {
                    router.push("/sign-up");
                }, 2000);
            } else if (err.errors?.[0]?.code === "form_password_incorrect") {
                setError("Incorrect password. Please try again.");
            } else {
                setError(err.errors?.[0]?.message || "An error occurred during sign-in. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div id="sign-in-container">
            <div id="video-container">
                <div id="video-content">
                    <Image src={VetraV} alt="Floating 7" width={500} height={500} />
                </div>
            </div>

            <div id="auth-container">
                <Image src={VetraLogo} alt="Floating 7" width={500} height={500} />
                <form id="auth-box" onSubmit={submit}>
                    <div id="our-creds">
                        <input
                            type="email"
                            name="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="Email"
                            disabled={isLoading}
                            required
                        />
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                disabled={isLoading}
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
                            </button>
                        </div>
                        <input 
                            type="submit" 
                            value={isLoading ? "Signing in..." : "Explore Vetra"} 
                            id="sign-in-btn"
                            disabled={isLoading}
                        />
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
                            id="google" 
                            className="api" 
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <i className="fa-brands fa-google"></i>
                            <p>Sign In with Google</p>
                        </button>
                        <button 
                            type="button" 
                            id="github" 
                            className="api" 
                            onClick={handleGithubSignIn}
                            disabled={isLoading}
                        >
                            <i className="fa-brands fa-github"></i>
                            <p>Sign In with Github</p>
                        </button>
                    </div>
                </form>

                <p className="create-account">
                    or <Link href="/sign-up" id="create-acc">create an account</Link>
                </p>
            </div>
        </div>
    );
}