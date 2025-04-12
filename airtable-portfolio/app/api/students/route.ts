import { NextRequest, NextResponse } from "next/server";
import { getStudents, createStudent } from "@/lib/student";


export async function GET() {
  try {
    const students = await getStudents();
    return NextResponse.json(students); 
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const created = await createStudent({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      class: data.class,
      projects: Array.isArray(data.projects) ? data.projects : [],
    });

    return NextResponse.json({ success: true, record: created }, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/students :", error);
    return NextResponse.json({ error: "Erreur création étudiant" }, { status: 500 });
  }
}
