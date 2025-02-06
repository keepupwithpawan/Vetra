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
    <div id="sign-in-container">
      <div id="video-container">
        <div id="video-content">
          <video
            src="https://res.cloudinary.com/dwkbeovcw/video/upload/v1737741369/Sign-in_Video_urvjww.mp4"
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>

      <div id="auth-container">
        <Image src={VetraLogo} alt="Floating 7" />
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
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isLoading}
              required
            />
            <button type="submit" id="sign-in-btn">
              Explore Vetra
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div id="hr-container">
            <hr className="signin-hr" />
            <p>or</p>
            <hr className="signin-hr" />
          </div>

          <div id="api-creds">
            <button
              type="button"
              id="google"
              className="api"
              onClick={() => handleOAuthSignIn("oauth_google", "Google")}
              disabled={isLoading}
            >
              <i className="fa-brands fa-google"></i>
              <p>Sign In with Google</p>
            </button>
            <button
              type="button"
              id="github"
              className="api"
              onClick={() => handleOAuthSignIn("oauth_github", "GitHub")}
              disabled={isLoading}
            >
              <i className="fa-brands fa-github"></i>
              <p>Sign In with GitHub</p>
            </button>
          </div>
        </form>

        <p className="create-account">
          or{" "}
          <Link href="/signup" id="create-acc">
            create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
