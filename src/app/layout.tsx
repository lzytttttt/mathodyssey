import type { Metadata } from "next";
import { Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/ui/Analytics";
import WebVitals from "@/components/ui/WebVitals";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: {
    default: "MathOdyssey — 数学的发现之旅",
    template: "%s | MathOdyssey",
  },
  description:
    "以数学史为主线的可视化学习平台，通过历史故事和互动实验理解数学概念。从古埃及丈量土地到牛顿发明微积分，体验数学如何被发明出来。",
  keywords: [
    "数学学习",
    "数学史",
    "互动实验",
    "可视化",
    "K12教育",
    "数学直觉",
    "发现式学习",
  ],
  authors: [{ name: "MathOdyssey" }],
  creator: "MathOdyssey",
  metadataBase: new URL("https://mathodyssey.com"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://mathodyssey.com",
    siteName: "MathOdyssey",
    title: "MathOdyssey — 数学的发现之旅",
    description:
      "以数学史为主线的可视化学习平台，通过历史故事和互动实验理解数学概念",
    images: [
      {
        url: "/api/og?title=MathOdyssey&subtitle=数学的发现之旅",
        width: 1200,
        height: 630,
        alt: "MathOdyssey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MathOdyssey — 数学的发现之旅",
    description:
      "以数学史为主线的可视化学习平台，通过历史故事和互动实验理解数学概念",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`h-full antialiased scroll-smooth ${inter.variable} ${notoSerifSC.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
