import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopAndGoogle from "@/components/ScrollToTopAndGoogle";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Optum Car Care | Premium Automotive Detailing",
  description: "Houston's trusted choice for premium auto care.",
};

async function getHomeConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/home-config/current/', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (Object.keys(data).length === 0) return null;
    return data;
  } catch (e) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getHomeConfig();
  const phone = config?.phone || '';

  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white font-sans" suppressHydrationWarning>
        <ConditionalLayout
          navbar={<Navbar />}
          footer={<Footer />}
          scrollHelper={<ScrollToTopAndGoogle config={config} />}
        >
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
