"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VetraLogo from "../../public/assets/Vetra-Logo.png";
import "./Signin.css";

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

  const checkProviderBeforeSignIn = async (email: string) => {
    try {
      const { supportedFirstFactors } = await signIn.create({ identifier: email });

      const hasOAuth = supportedFirstFactors!.some(factor =>
        ["oauth_google", "oauth_github"].includes(factor.strategy)
      );

      if (hasOAuth) {
        setError("You signed up using Google or GitHub. Please use that method to log in.");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error checking email provider:", err);
      return true; // Allow login if we can't determine the provider
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!signIn || !setActive) {
      setError("Sign-in is unavailable. Please try again later.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Check if the email is linked to Google/GitHub before signing in
    const canProceed = await checkProviderBeforeSignIn(emailAddress);
    if (!canProceed) {
      setIsLoading(false);
      return;
    }

    try {
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
        setError(
          err.errors?.[0]?.message || "An error occurred during sign-in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = async (strategy: "oauth_google" | "oauth_github", provider: string) => {
    try {
      setIsLoading(true);
      setError("");

      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/grid`,
      });
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setError(`An error occurred during ${provider} sign-in. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row justify-between items-center p-4">
      {/* Video container - hidden on mobile */}
      <div className="hidden lg:flex w-1/2 h-[98vh] relative items-center justify-center rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center rounded-lg">
          <video
            src="https://res.cloudinary.com/dwkbeovcw/video/upload/v1737741369/Sign-in_Video_urvjww.mp4"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] object-cover rounded-lg"
            autoPlay
            muted
            loop
          />
        </div>
      </div>

      {/* Auth container */}
      <div className="w-full lg:w-[49.3%] min-h-screen lg:h-[98vh] py-8 flex flex-col items-center justify-center rounded-lg bg-black">
        <Image src={VetraLogo} alt="Vetra Logo" className="w-24" />
        
        <form className="w-full max-w-md px-6 mt-12" onSubmit={submit}>
          <div className="space-y-6">
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder="Email"
              disabled={isLoading}
              required
              className="w-full p-4 bg-white/[.082] text-white rounded-lg focus:outline-none text-base"
            />
            
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              required
              className="w-full p-4 bg-white/[.082] text-white rounded-lg focus:outline-none text-base"
            />
            
            <button
              type="submit"
              className="w-full p-5 bg-white text-black font-bold rounded-lg hover:opacity-70 hover:rounded-[50px] transition-all duration-500"
            >
              Explore Vetra
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm mt-12">
              {error}
            </div>
          )}

          <div className="flex items-center justify-center space-x-4 mt-16">
            <hr className="w-24 opacity-30" />
            <span className="text-sm">or</span>
            <hr className="w-24 opacity-30" />
          </div>

          <div className="space-y-4 mt-6">
            <button
              type="button"
              onClick={() => handleOAuthSignIn("oauth_google", "Google")}
              disabled={isLoading}
              className="w-full p-4 bg-white/[.082] text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-500 flex items-center"
            >
              <i className="fa-brands fa-google" />
              <span className="ml-4">Sign In with Google</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleOAuthSignIn("oauth_github", "GitHub")}
              disabled={isLoading}
              className="w-full p-4 bg-white/[.082] text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-500 flex items-center"
            >
              <i className="fa-brands fa-github" />
              <span className="ml-4">Sign In with GitHub</span>
            </button>
          </div>
        </form>

        <p className="mt-6">
          or{" "}
          <Link 
            href="/signup"
            className="relative hover:after:w-full after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300"
          >
            create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
