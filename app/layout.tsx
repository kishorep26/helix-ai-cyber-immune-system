import type { Metadata } from "next";
import { JetBrains_Mono, Rajdhani } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
    subsets: ["latin"],
    variable: '--font-jetbrains',
});

const rajdhani = Rajdhani({
    weight: ['400', '500', '600', '700'],
    subsets: ["latin"],
    variable: '--font-rajdhani',
});

export const metadata: Metadata = {
    title: "CORTEX // ADVANCED DEFENSE",
    description: "Self-Healing AI Cyber Immune Network",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${jetbrains.variable} ${rajdhani.variable} antialiased bg-black text-slate-200`}
            >
                {children}
            </body>
        </html>
    );
}
