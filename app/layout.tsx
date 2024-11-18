import type { Metadata } from "next";

import Navbar from "../components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "C.A.S App",
  description: "Application de gestion des menbres du C.A.S",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <Navbar />
        <div className="lg:pl-72"> {children} </div>
      </body>
    </html>
  );
}
