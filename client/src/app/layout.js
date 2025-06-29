import { Inter } from "next/font/google";
import "./globals.css";
import ParticlesBackground from "@/components/ui/ParticlesBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LinkHub - Your Digital Link Sanctuary",
  description: "Organize, search, and manage all your important links in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} relative`}>
        <ParticlesBackground />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}