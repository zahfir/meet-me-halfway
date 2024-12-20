import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/app/styles/globals.scss";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meet Me Halfway",
  description: "Geographic centroid calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
