"use client"
import React, { useState } from 'react';
import { useAuth, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [successfulCreation, setSuccessfulCreation] = useState(false);
    const [secondFactor, setSecondFactor] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { isLoaded, signIn, setActive } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    if (isSignedIn) {
        router.push('/');
        return null;
    }

    async function create(e: React.FormEvent) {
        e.preventDefault();
        try {
            await signIn?.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            });
            setSuccessfulCreation(true);
            setError('');
        } catch (err: any) {
            console.error('error', err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
        }
    }

    async function reset(e: React.FormEvent) {
        e.preventDefault();
        try {
            const result = await signIn?.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            });

            if (result?.status === 'needs_second_factor') {
                setSecondFactor(true);
                setError('');
            } else if (result?.status === 'complete' && result.createdSessionId) {
                if (setActive) {
                    setActive({ session: result.createdSessionId });
                }
                setError('');
                router.push('/');
            }
        } catch (err: any) {
            console.error('error', err.errors[0].longMessage);
            setError(err.errors[0].longMessage);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md p-6 space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {!successfulCreation ? 'Reset your password' : 'Check your email'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {!successfulCreation
                            ? "Enter your email address and we'll send you a reset link"
                            : "We sent you a code. Enter it below along with your new passwor"}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={!successfulCreation ? create : reset}>
                    {!successfulCreation ? (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="code">Reset Code</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="Enter the code from your email"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button type="submit" className="w-full">
                        {!successfulCreation ? 'Send Reset Instructions' : 'Reset Password'}
                    </Button>
                </form>

                <Separator />

                <div className="text-center text-sm">
                    <Button
                        variant="link"
                        className="text-muted-foreground hover:text-primary"
                        onClick={() => router.push('/sign-in')}
                    >
                        Back to Sign in
                    </Button>
                </div>

                {secondFactor && (
                    <Alert>
                        <AlertDescription>
                            Two-factor authentication is required. Please use your authenticator app.
                        </AlertDescription>
                    </Alert>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;