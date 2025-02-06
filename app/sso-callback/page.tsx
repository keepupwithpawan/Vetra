"use client";
import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SSOCallback() {
    const { handleRedirectCallback } = useClerk();
    const router = useRouter();

    useEffect(() => {
        async function handleCallback() {
            try {
                const result = await handleRedirectCallback({
                    afterSignInUrl: "/grid",
                    afterSignUpUrl: "/grid",
                });
                
                if (result !== undefined) {
                    router.push("/grid");
                }
            } catch (err) {
                console.error("OAuth error:", err);
                router.push("/sign-up?error=oauth-failed");
            }
        }

        handleCallback();
    }, [handleRedirectCallback, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Setting up your account...</h2>
                <p className="text-muted-foreground">Please wait while we complete the process.</p>
            </div>
        </div>
    );
}