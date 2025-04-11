import { NextRequest, NextResponse } from "next/server";
import { updateProjet } from "@/lib/project";
import { deleteProjet } from "@/lib/project";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant dans l'URL" }, { status: 400 });
    }

    const data = await req.json();

    const updated = await updateProjet(id, {
      name: data.name,
      description: data.description,
      link: data.link,
      students: Array.isArray(data.students)
        ? data.students.filter((s: string) => s !== "")
        : [],
      subjects: Array.isArray(data.subjects)
        ? data.subjects.filter((s: string) => s !== "")
        : [],
      visibility: data.visibility === true,
    });

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Erreur PUT /api/projects/[id]:", error);
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

    const deleted = await deleteProjet(id); 
    return NextResponse.json({ success: true, record: deleted });
  } catch (error) {
    console.error("Erreur DELETE /api/projects/[id]:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}

