export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect root ("/") to /login
  if (pathname === "/") {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Check if the user is authenticated
  const supabase = await createClient();
  const {
    data: { session },
  } = await (await supabase).auth.getSession();

  // Auth routes that don't require authentication
  const authRoutes = ["/login", "/signup", "/reset-password"];

  // If the user is not authenticated and trying to access a protected route
  if (!session && pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is authenticated and trying to access an auth route
  if (session && authRoutes.some((route) => pathname === route)) {
    const redirectUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/reset-password", "/"],
};
