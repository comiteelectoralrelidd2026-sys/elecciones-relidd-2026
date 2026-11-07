import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elecciones Nacionales y Departamentales RELIDD 2026",
  description: "Portal oficial del Comité Electoral de la Red de Líderes para el Desarrollo y la Democracia (RELIDD). Participa. Decide. Construye.",
  icons: {
    icon: "/img/favicon.png",
  },
  themeColor: "#A40029",
  openGraph: {
    title: "Elecciones RELIDD 2026",
    description: "Participa. Decide. Construye. Portal oficial del Comité Electoral.",
    images: ["/img/logo-elecciones.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-white text-relidd-ink antialiased">
        {children}
      </body>
    </html>
  );
}
