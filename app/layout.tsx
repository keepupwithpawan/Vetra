import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vetra",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script src="https://kit.fontawesome.com/4b1022cf8e.js" crossOrigin="anonymous"></script>
          <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400&display=swap" rel="stylesheet"></link>
          <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500&f[]=zodiak@800&f[]=gambarino@400&f[]=sentient@400&f[]=melodrama@400&f[]=dancing-script@700&f[]=satoshi@300,400&f[]=general-sans@400&f[]=switzer@300&f[]=pencerio@50&f[]=bonny@400&f[]=aktura@400&f[]=britney@400&f[]=rowan@400&display=swap" rel="stylesheet"></link>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div>
            <UserButton afterSignOutUrl="/" />
          </div>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
