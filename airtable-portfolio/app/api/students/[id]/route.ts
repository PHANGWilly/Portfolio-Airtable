import { NextRequest, NextResponse } from "next/server";
import { updateStudent, deleteStudent } from "@/lib/student";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const data = await req.json();

    const updated = await updateStudent(id, {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      class: data.class,
      projects: Array.isArray(data.projects) ? data.projects : [],
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Erreur PUT /api/students/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const deleted = await deleteStudent(id);
    return NextResponse.json({ success: true, record: deleted });
  } catch (error) {
    console.error("Erreur DELETE /api/students/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
