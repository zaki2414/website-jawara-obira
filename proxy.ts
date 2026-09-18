import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  if (
    process.env.NODE_ENV === "development" &&
    process.env.DISABLE_ADMIN_AUTH === "true"
  ) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("🔍 [Middleware] User:", user?.email || "null");
  console.log("🔍 [Middleware] Error:", error?.message || "none");

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    console.log("⛔ [Middleware] Blocking access to /admin - no user");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && request.nextUrl.pathname === "/login") {
    console.log("✅ [Middleware] Redirecting logged-in user to /admin");
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/auth/callback"],
};
