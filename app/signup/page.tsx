"use client";

import React, { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import VetraLogo from "../../public/assets/Vetra-Logo.png";

type Strategy = 'oauth_google' | 'oauth_github';

const SignUp = () => {
  const { isLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleError = (err: any, defaultMessage: string): void => {
    console.error(defaultMessage, err);
    setError(err?.errors?.[0]?.message || defaultMessage);
    setLoading(false);
  };

  const handleSocialSignUp = async (strategy: Strategy): Promise<void> => {
    if (!isLoaded) return;
    try {
      setLoading(true);
      setError("");
      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/grid`,
      });
    } catch (err: any) {
      handleError(err, `Failed to sign up with ${strategy === 'oauth_google' ? 'Google' : 'GitHub'}`);
    }
  };

  async function submit(e:any) {
    e.preventDefault();
    if (!isLoaded) return;

    if (!validateEmail(emailAddress)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      handleError(err, "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  async function onPressVerify(e:any) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });
      if (completeSignUp.status !== "complete") {
        throw new Error("Failed to verify email");
      }
      router.push("/grid");
    } catch (err) {
      handleError(err, "Failed to verify email");
    }
  }

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      <span>{pendingVerification ? "Verifying..." : "Creating Account..."}</span>
    </div>
  );

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
        
        <div className="w-full max-w-md px-6 mt-12">
          {!pendingVerification ? (
            <form onSubmit={submit} className="space-y-6">
              <div id="clerk-captcha" />
              <div className="space-y-4">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email"
                  disabled={loading}
                  required
                  className="w-full p-4 bg-white/[.082] text-white rounded-lg focus:outline-none"
                />
                
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    disabled={loading}
                    required
                    className="w-full p-4 bg-white/[.082] text-white rounded-lg focus:outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full p-5 bg-white text-black font-bold rounded-lg hover:opacity-70 hover:rounded-[50px] transition-all duration-500"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner /> : "Create Account"}
                </button>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center mt-4">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-center space-x-4 mt-8">
                <hr className="w-24 opacity-30" />
                <span className="text-sm text-white">or</span>
                <hr className="w-24 opacity-30" />
              </div>

              <div className="space-y-4 mt-6">
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('oauth_google')}
                  className="w-full p-4 bg-white/[.082] text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-500 flex items-center justify-center"
                  disabled={loading}
                >
                  <i className="fa-brands fa-google mr-4" />
                  <span>Sign up with Google</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialSignUp('oauth_github')}
                  className="w-full p-4 bg-white/[.082] text-white rounded-lg hover:bg-white hover:text-black transition-colors duration-500 flex items-center justify-center"
                  disabled={loading}
                >
                  <i className="fa-brands fa-github mr-4" />
                  <span>Sign up with GitHub</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onPressVerify} className="space-y-6">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
                disabled={loading}
                required
                className="w-full p-4 bg-white/[.082] text-white rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="w-full p-5 bg-white text-black font-bold rounded-lg hover:opacity-70 hover:rounded-[50px] transition-all duration-500"
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : "Verify Email"}
              </button>
              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        <p className="mt-8 text-white">
          Already have an account?{" "}
          <Link 
            href="/signin"
            className="relative hover:after:w-full after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
