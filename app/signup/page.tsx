"use client";
import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VetraLogo from "../../public/assets/Vetra-Logo.png";
import Image from "next/image";
import "./Signup.css";

function VetraSignup() {
  const { isLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return null;
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
      setError(
        err?.errors?.[0]?.message ||
          "Failed to sign up with Google. Please try again."
      );
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
        redirectUrlComplete: `${window.location.origin}/grid`,
      });
    } catch (err: any) {
      console.error("GitHub signup error:", err);
      setError(
        err?.errors?.[0]?.message ||
          "Failed to sign up with GitHub. Please try again."
      );
      setLoading(false);
    }
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
    } catch (err: any) {
      console.error("Email signup error:", err);
      setError(
        err?.errors?.[0]?.message || "Failed to sign up. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function onPressVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");

      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status !== "complete") {
        throw new Error("Failed to verify email");
      }

      router.push("/grid");
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(
        err?.errors?.[0]?.message || "Failed to verify email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="vetra-signup-container">
      <div className="vetra-video-container">
        <div className="vetra-video-content">
          <video
            src="https://res.cloudinary.com/dwkbeovcw/video/upload/v1737741369/Sign-in_Video_urvjww.mp4"
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>

      <div className="vetra-auth-container">
        <Image src={VetraLogo} alt="Floating 7" width={500} height={500} />
        <div className="vetra-auth-box">
          {!pendingVerification ? (
            <form onSubmit={submit}>
              <div className="vetra-credentials">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email"
                  disabled={loading}
                  required
                />
                <div className="vetra-password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={loading}
                    required
                  />
                </div>
                <button type="submit" className="vetra-submit-btn">
                  Create Account
                </button>
              </div>

              {error && <div className="vetra-error-message">{error}</div>}

              <div className="vetra-divider">
                <hr />
                <p>or</p>
                <hr />
              </div>

              <div className="vetra-oauth-methods">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  className="vetra-oauth-btn"
                  disabled={loading}
                >
                  <i className="fa-brands fa-google"></i>
                  <p>Sign up with Google</p>
                </button>
                <button
                  type="button"
                  onClick={handleGithubSignUp}
                  className="vetra-oauth-btn"
                  disabled={loading}
                >
                  <i className="fa-brands fa-github"></i>
                  <p>Sign up with Github</p>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onPressVerify}>
              <div className="vetra-credentials">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  disabled={loading}
                  required
                />
                <input
                  type="submit"
                  value={loading ? "Verifying..." : "Verify Email"}
                  className="vetra-submit-btn"
                  disabled={loading}
                />
              </div>
              {error && <div className="vetra-error-message">{error}</div>}
            </form>
          )}
        </div>

        <p className="vetra-account-link">
          Already have an account?{" "}
          <Link href="/sign-in" className="vetra-signin-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VetraSignup;