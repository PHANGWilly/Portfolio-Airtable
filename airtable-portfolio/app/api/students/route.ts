import { NextRequest, NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Student } from "@/types/Student";

export async function GET(req: NextRequest) {
  try {
    const students = (await getTableRecords("student")) as Student[];

    //trier par nom
    students.sort((a, b) =>
      a.fields.firstname.localeCompare(b.fields.firstname)
    );

    return NextResponse.json(students);
  } catch (error) {
    console.error("Erreur GET /api/students:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
