import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 mengganti nama konvensi `middleware.ts` jadi `proxy.ts`
// (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:
// "The `middleware` file convention is deprecated and has been renamed to
// `proxy`"). Fungsinya identik — hanya nama file dan nama fungsi yang berubah.
export async function proxy(request: NextRequest) {
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

  // supabase.auth.getUser() bisa MELEMPAR (bukan cuma isi field `error`) saat
  // Supabase Auth kena rate-limit (AuthApiError 429). Middleware Next.js tidak
  // punya error.tsx sendiri — exception tak tertangkap di sini bikin SETIAP
  // request ke /admin,/login,/auth/callback crash dengan stack trace mentah,
  // bukan cuma request yang lagi login. Tangkap di sini supaya request tetap
  // diteruskan ke page; guard sebenarnya (getAdminUser() di lib/auth.ts) yang
  // sudah punya error.tsx boundary per-route (manual retry, tidak auto-loop).
  let user = null;
  try {
    const {
      data: { user: fetchedUser },
      error,
    } = await supabase.auth.getUser();
    user = fetchedUser;
    // Email pengguna SENGAJA tidak di-log. Log Vercel tersimpan dan terbaca
    // siapa pun yang punya akses dashboard project, sementara ini berjalan di
    // SETIAP request ke /admin — jadi satu-satunya yang dicatat di sini adalah
    // kegagalan yang tidak terduga, tanpa identitas.
    if (error) {
      console.error("[proxy] getUser() mengembalikan error:", error.message);
    }
  } catch (err) {
    console.error(
      "[proxy] getUser() melempar:",
      err instanceof Error ? err.message : err,
    );
    return response;
  }

  if (request.nextUrl.pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/auth/callback"],
};
