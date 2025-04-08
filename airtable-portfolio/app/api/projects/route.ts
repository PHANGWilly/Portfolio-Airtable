import { NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";

export async function GET() {
  try {
    const records = await getTableRecords("project");
    return NextResponse.json(records);
  } catch (error) {
    console.error("Erreur récupération projets:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
