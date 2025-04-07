import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { getUsers } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const { email, motDePasse } = await req.json();

    // On récupère tous les users depuis Airtable
    const utilisateurs = await getUsers();

    // On cherche l'utilisateur qui a le champ email correspondant
    const foundUser = utilisateurs.find((u) => u.fields.email === email);

    // Si pas trouvé, ou mot de passe incorrect
    if (!foundUser) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    // On compare le mot de passe saisi (motDePasse) avec le hash (foundUser.fields.password)
    const match = await bcrypt.compare(motDePasse, foundUser.fields.password);
    if (!match) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
    }

    // Génération d'un token JWT
    const token = jwt.sign({ id: foundUser.id, email }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    // On renvoie le token
    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("/api/login error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
