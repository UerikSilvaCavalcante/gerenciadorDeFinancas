import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { jwtDecode } from "jwt-decode";

export async function Autentication(request: NextRequest) {
  const cookiesData = await cookies();
  const token = cookiesData.get("token");

  const response = NextResponse.next();

  response.headers.set("X-From-Middleware", "HelloUerik");
  response.headers.set("Cache-Control", "no-store");

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = ["/home", "/transfers", "/card_transfer", "/config"].some(
    (route) => pathname.startsWith(route)
  );

  if (!token && isProtectedRoute) {
    const url = new URL("/", request.url);
    url.searchParams.set("unanthorized", "True");
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token) {
    try {
      const decoded = jwtDecode<{
        id: string;
        exp: number;
      }>(token.value);

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expirado
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("token");
        return response;
      }
    } catch  {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("token");
      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/home/:path*", "/transfers/:path*", "/card_transfer/:path*", "/config/:path*"],
};

export { Autentication as middleware };
