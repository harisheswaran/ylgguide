import { Inter, Satisfy, Oswald } from "next/font/google";
import "./globals.css";
import "./polyfills";
import { AuthProvider } from './context/AuthContext';
import { Providers } from './providers';

import AIAnalytics from '@/components/ai/AIAnalytics';
import EmergencySOSButton from '@/components/practical/EmergencySOSButton';
import LanguageTranslator from '@/components/practical/LanguageTranslator';
import OfflineMode from '@/components/practical/OfflineMode';
import BudgetTracker from '@/components/practical/BudgetTracker';
import Sidebar from "@/components/layout/Sidebar";
import FloatingAIButton from '@/components/ai/FloatingAIButton';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const satisfy = Satisfy({ weight: "400", subsets: ["latin"], variable: "--font-satisfy" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata = {
  title: "Go Elagiri",
  description: "Your guide to Yelagiri, your way!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${satisfy.variable} ${oswald.variable} ${inter.className}`}>
        <Providers>
          <AuthProvider>
            {children}
            <Sidebar />
            <FloatingAIButton />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
