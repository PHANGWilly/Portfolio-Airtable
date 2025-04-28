import { NextRequest, NextResponse } from "next/server";
import { updateSubject, deleteSubject } from "@/lib/subject";

export async function PUT(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const data = await req.json();
    const updated = await updateSubject(id, data);

    return NextResponse.json({ success: true, record: updated });
  } catch (error) {
    console.error("Erreur PUT /api/subjects/[id]:", error);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const deleted = await deleteSubject(id);
    return NextResponse.json({ success: true, record: deleted });
  } catch (error) {
    console.error("Erreur DELETE /api/subjects/[id]:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
