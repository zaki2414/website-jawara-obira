// app/auth/callback/route.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (error) {
    console.error("OAuth Error:", error, errorDescription);
    return NextResponse.redirect(
      new URL(`/login?error=${error}`, requestUrl.origin),
    );
  }

  const response = NextResponse.redirect(new URL("/admin", requestUrl.origin));

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    try {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) throw exchangeError;
    } catch (err: unknown) {
      console.error(
        "[auth/callback] exchangeCodeForSession gagal:",
        err instanceof Error ? err.message : err,
      );
      return NextResponse.redirect(
        new URL("/login?error=exchange_failed", requestUrl.origin),
      );
    }
  }

  return response;
}
