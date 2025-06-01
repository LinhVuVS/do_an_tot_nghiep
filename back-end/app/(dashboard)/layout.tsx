import type { Metadata } from "next";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import "../globals.css";

import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import LeftSideBar from "@/components/Layout/LeftSideBar";
import TopBar from "@/components/Layout/TopSideBar";
const ToasterProvider = dynamic(() => import("@/lib/ToastProvider").then((mod) => mod.ToasterProvider), { ssr: false });

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Momoko - Admin Dashboard",
    description: "Admin dashboard to manage Momoko's data",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ToasterProvider />
                    <div className="flex max-lg:flex-col text-grey-1">
                        <LeftSideBar />
                        <TopBar />
                        <div className="flex-1">{children}</div>
                    </div>
                </body>
            </html>
        </ClerkProvider>
    );
}
