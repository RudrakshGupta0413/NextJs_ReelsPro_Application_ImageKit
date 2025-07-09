import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl;

                // allow auth related routes
                if(
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/login") ||
                    pathname.startsWith("/register")
                ) {
                    return true;
                }

                //public
                if(pathname === "/" || pathname.startsWith("/api/videos")) {
                    return true;
                }

                return !!token
            }
        }
    }
)

// it tells where the middleware should run
export const config = {
    matcher: ["/((?!_next|_static|favicon.ico|api/auth|auth|login|register).*)"],
}