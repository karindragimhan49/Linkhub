import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { /* ... */ };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster position="top-center" toastOptions={{ style: { background: '#334155', color: '#F1F5F9' } }} />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}