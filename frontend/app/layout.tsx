import "./globals.css";
import { Poppins } from "next/font/google"; 

export const metadata = {
  title: "Desafio Clima",
  description: "Wrapper de clima com FastAPI e Next.js",
};

const poppins = Poppins({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${poppins.variable}`}>
      <body className="font-poppins antialiased">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
