import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = createRouteMatcher([
    '/',
    '/api/webhook/register',
    '/signin',
    '/signup',
    '/signin/(.*)',
    '/signup/(.*)',
    "/forgot-password", 
    '/sso-callback',
    '/sso-callback/(.*)',
    '/error',
    '/about',
    '/devs',
    '/contact',
    '/pricing'
]);

const adminRoutes = createRouteMatcher([
    '/admin',
    '/admin/(.*)',
    '/admin/dashboard'
]);

const dashboardRoute = createRouteMatcher(['/grid']);

export default clerkMiddleware(async (authFn, req) => {
    try {
        const { pathname } = new URL(req.url);
        if (
            pathname.startsWith('/_next') ||
            pathname.startsWith('/static') ||
            pathname.includes('favicon.ico') ||
            pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/)
        ) {
            return NextResponse.next();
        }

        const auth = await authFn();
        const { userId } = auth;

        console.log('Middleware triggered for:', req.url);
        console.log('User ID:', userId);

        if (!userId && !publicRoutes(req)) {
            console.log('Unauthenticated user trying to access a protected route');
            const signInUrl = new URL('/signin', req.url);
            signInUrl.searchParams.set('redirect_url', req.url);
            return NextResponse.redirect(signInUrl);
        }

        if (userId) {
            if (publicRoutes(req) && !['/sso-callback', '/error'].some(route => req.url.includes(route))) {
                console.log('Authenticated user trying to access public route');
                return NextResponse.redirect(new URL('/grid', req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        console.error('Error in middleware:', error);

        if (!req.url.includes('/error')) {
            return NextResponse.redirect(new URL('/error', req.url));
        }

        return NextResponse.next();
    }
});

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
