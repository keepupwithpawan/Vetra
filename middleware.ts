import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers
const publicRoutes = createRouteMatcher([
    '/',
    '/api/webhook/register',
    '/signin',
    '/sign-up',
    '/signin/(.*)',
    '/sign-up/(.*)',
    "/forgot-password", 
    '/sso-callback',
    '/sso-callback/(.*)',
    '/error'
]);

const adminRoutes = createRouteMatcher([
    '/admin',
    '/admin/(.*)',
    '/admin/dashboard'
]);

const dashboardRoute = createRouteMatcher(['/grid']);

export default clerkMiddleware(async (authFn, req) => {
    try {
        // Skip middleware for static files and resources
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

        // Handle unauthenticated users
        if (!userId && !publicRoutes(req)) {
            console.log('Unauthenticated user trying to access a protected route');
            const signInUrl = new URL('/signin', req.url);
            signInUrl.searchParams.set('redirect_url', req.url);
            return NextResponse.redirect(signInUrl);
        }

        // Handle authenticated users
        if (userId) {
            const user = auth.user;
            const role = user?.publicMetadata?.role as string | undefined;

            // Admin route protection
            if (adminRoutes(req) && role !== 'admin') {
                console.log('Non-admin user redirected from admin route');
                return NextResponse.redirect(new URL('/grid', req.url));
            }

            // Redirect admin users from regular dashboard to admin dashboard
            if (dashboardRoute(req) && role === 'admin') {
                console.log('Admin user accessing dashboard route');
                return NextResponse.redirect(new URL('/admin/dashboard', req.url));
            }

            // Redirect authenticated users from public routes
            if (publicRoutes(req) && !['/sso-callback', '/error'].some(route => req.url.includes(route))) {
                console.log('Authenticated user trying to access public route');
                return NextResponse.redirect(
                    new URL(role === 'admin' ? '/grid' : '/grid', req.url)
                );
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
        /*
         * Match all request paths except for the ones starting with:
         * - _next
         * - static (static files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};