/**
 * Auth route group layout — no Navbar or MobileNav chrome.
 * Login and Register pages render full-screen without header/footer.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
