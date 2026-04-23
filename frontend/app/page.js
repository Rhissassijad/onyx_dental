"use client";

import Navbar from "@/components/Navbar";
import Presentation from "@/components/Presentation";
import Emplacement from "@/components/Emplacement";
import Contacts from "@/components/Contacts";
import Rdv from "@/components/Rdv";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Presentation />
      <Emplacement />
      <Rdv />
      <Contacts />
    </main>
  );
}
