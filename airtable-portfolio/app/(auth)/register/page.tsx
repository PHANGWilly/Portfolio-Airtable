"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Envoi du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstname, lastname, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert("Erreur: " + data.error);
      return;
    }

    alert("Inscription réussie !");
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <h1 className="text-2xl font-semibold mb-6">Inscription</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstname" className="block mb-1">
            Prénom
          </label>
          <input
            id="firstname"
            type="text"
            className="border w-full p-2"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="lastname" className="block mb-1">
            Nom
          </label>
          <input
            id="lastname"
            type="text"
            className="border w-full p-2"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="border w-full p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            className="border w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          S inscrire
        </button>
      </form>
    </div>
  );
}
