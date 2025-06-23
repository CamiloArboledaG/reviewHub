import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="pl-64 pt-16">{children}</main>
    </>
  );
} 