import { NextResponse } from "next/server";
import { createUser } from "@/lib/user";
import bcrypt from "bcryptjs";

// Tu peux l'appeler '/app/api/register/route.ts'
export async function POST(req: Request) {
  try {
    // 1. Récupérer le body
    const { firstname, lastname, email, password } = await req.json();

    // 2. Vérifier qu'on a tout
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // 3. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Créer le user dans Airtable
    const newUser = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    // 5. Retourner l'ID du nouvel enregistrement
    return NextResponse.json({ success: true, id: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("❌ /api/register error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
