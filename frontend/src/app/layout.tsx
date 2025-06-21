import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReviewHub",
  description: "Tu plataforma centralizada de reseñas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-background text-foreground`}>
        <QueryProvider>
          <Header />
          <Sidebar />
          <main className="pl-64 pt-16">{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
