import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const { e } = await searchParams;
  return (
    <main className="ad-login">
      <div className="ad-card">
        <span className="ad-mark" aria-hidden="true">AA</span>
        <h1>Sign in to admin</h1>
        <p className="ad-sub">Use the email and password of your administrator account.</p>
        {e === "forbidden" && <p className="ad-err" role="alert">That account isn&apos;t an administrator.</p>}
        <LoginForm />
      </div>
    </main>
  );
}
