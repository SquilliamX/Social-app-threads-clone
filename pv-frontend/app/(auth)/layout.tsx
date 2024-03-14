import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";


export const metadata = {
    title: `People's Voice`,
    description: `A platform to crowdfund any actions in society.`
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children
    }: {
    children: React.ReactNode
}) {
    return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
