import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Burgess Attorneys | Kuils River Legal Services",
    template: "%s | Burgess Attorneys"
  },
  description:
    "Burgess Attorneys Inc is a boutique law firm in Kuils River, Cape Town, offering practical legal support with personal attention.",
  openGraph: {
    title: "Burgess Attorneys",
    description:
      "Boutique legal services in Kuils River and the Northern Suburbs of Cape Town.",
    type: "website",
    locale: "en_ZA"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
