import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UrbanCart",
  description: "A modern e-commerce platform built with Next.js, Tailwind CSS, and Prisma. Explore a wide range of products, enjoy seamless shopping experiences, and discover the future of online retail with UrbanCart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
