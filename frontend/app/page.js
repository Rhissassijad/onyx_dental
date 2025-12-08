"use client";

import Navbar from "@/components/Navbar";
import Presentation from "@/components/Presentation";
import Equipe from "@/components/Equipe";
import Galerie from "@/components/Galerie";
import Emplacement from "@/components/Emplacement";
import Contacts from "@/components/Contacts";
import Rdv from "@/components/Rdv";

export default function Home() {
  return (
    <main className="font-sans">
      <Navbar />
      <Presentation />
      <Equipe />
      <Galerie />
      <Emplacement />
      <Rdv />
      <Contacts />
      
    </main>
  );
}
