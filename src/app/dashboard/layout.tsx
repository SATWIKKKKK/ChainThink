import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">ChainThink</h1>
          <nav className="flex gap-4">
            <a href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
