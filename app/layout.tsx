import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppStateProvider } from "@/components/app-state";
import { SiteHeader } from "@/components/site-header";
import { ensureDemoData, getAppSnapshot } from "@/lib/server/services";

import "./globals.css";

export const metadata: Metadata = {
  title: "Project Ganit",
  description: "NCERT Mathematics paid learning MVP for Class 10, designed as a mobile-first PWA."
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  ensureDemoData();
  const snapshot = getAppSnapshot();

  return (
    <html lang="en">
      <body>
        <AppStateProvider initialSnapshot={snapshot}>
          <SiteHeader />
          {children}
        </AppStateProvider>
      </body>
    </html>
  );
}
