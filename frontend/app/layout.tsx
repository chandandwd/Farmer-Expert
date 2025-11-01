import "./globals.css";
import { Navbar } from "../components/Navbar";

export const metadata = {
  title: "CropXpert",
  description: "Smart Farming Assistance Platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body class Name="bg-green-50 text-gray-900">
        <Navbar />
        <main class Name="p-6">{children}</main>
      </body>
    </html>
  );
}
