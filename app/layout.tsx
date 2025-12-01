import type { Metadata } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import "./custom.css";
import { ThemeProvider } from "@/components/theme-provider";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import "@fortawesome/fontawesome-svg-core/styles.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sehatin - Digital Nutrition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased bg-surface text-gray-800 dark:bg-darkBg dark:text-gray-100 min-h-screen  transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
