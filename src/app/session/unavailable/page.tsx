import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function SessionUnavailablePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-ink">Session unavailable</h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          Postgres is not connected, or teaching assets are not seeded. Run
          migrations and <code>npx prisma db seed</code> on this machine.
        </p>
        <p className="mt-6">
          <Link href="/" className="text-accent underline">
            Back to Teach Me
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
