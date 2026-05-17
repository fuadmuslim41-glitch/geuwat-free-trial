import type { Metadata } from "next";
import "./globals.css";
import "./styles/scrollbar.css";
import { AuthProvider } from "@/contexts/MemberAuthContext";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import DesktopBottomNav from "@/app/components/DesktopBottomNav";
import SkillThemeSync from "@/app/components/SkillThemeSync";
import { GlobalHaptic } from "@/app/components/haptic";
import KepalaTeaserMount from "@/app/components/KepalaTeaserMount";
import { GuideProvider } from "@/contexts/GuideContext";



export const metadata: Metadata = {
  title: "GEUWAT Free Trial - Learn English",
  description: "Free trial English learning dashboard for GEUWAT members",
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <GlobalHaptic>
            <GuideProvider>
              {children}
              <SkillThemeSync />
              <MobileBottomNav />
              <DesktopBottomNav />
              <KepalaTeaserMount />
            </GuideProvider>
          </GlobalHaptic>
        </AuthProvider>
      </body>
    </html>
  );
}
