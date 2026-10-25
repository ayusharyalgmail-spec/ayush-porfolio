"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap" style={{ minHeight: "70svh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <h1 style={{ fontSize: "clamp(1.6rem, 5vw, 2.6rem)" }}>Something went wrong</h1>
        <p className="lead" style={{ margin: "12px auto 24px" }}>This page could not load. Try again, or come back in a minute.</p>
        <button type="button" className="btn main" onClick={reset}>Try again</button>
      </div>
    </main>
  );
}
