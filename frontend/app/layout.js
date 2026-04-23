import "./globals.css";

export const metadata = {
  title: "Onyx Dental Office | Cabinet Dentaire a Bouskoura",
  description:
    "Cabinet dentaire a Bouskoura : soins modernes et prise de rendez-vous simple en francais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr-MA">
      <body>{children}</body>
    </html>
  );
}
