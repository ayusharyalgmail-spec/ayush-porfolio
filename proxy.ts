import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Guards /admin: refreshes the Supabase session and sends signed-out visitors to the login page. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const toLogin = () => NextResponse.redirect(new URL("/admin/login", request.url));

  if (!url || !key) return pathname === "/admin/login" ? NextResponse.next() : toLogin();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims && pathname !== "/admin/login") return toLogin();
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
