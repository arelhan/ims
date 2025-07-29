import "./globals.css";

export const metadata = {
  title: "IMS for IT",
  description: "BT için Envanter Yönetim Sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
