import { NextRequest, NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Subject } from "@/types/Subject";
import { createSubject } from "@/lib/subject";

export async function GET() {
  try {
    const subjects = await getTableRecords("subject") as Subject[];
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Erreur GET /api/subjects :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const created = await createSubject({
      name: data.name,
      subject: data.subject,
      year: data.year,
      cycle: data.cycle,
      semester: data.semester,
      description: data.description,
      projects: Array.isArray(data.projects) ? data.projects : [],
    });

    return NextResponse.json({ success: true, record: created }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/subjects :", error);
    return NextResponse.json({ error: "Erreur création matière" }, { status: 500 });
  }
}
