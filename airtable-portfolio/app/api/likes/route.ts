import { NextRequest, NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Like } from "@/types/Like";

export async function POST(req: NextRequest) {
  try {
    const { project, user } = await req.json();

    if (!project || !user) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const likes = (await getTableRecords("like")) as Like[];

    const alreadyLiked = likes.find(
      (like) =>
        like.fields.project?.includes(project) &&
        like.fields.user?.includes(user)
    );

    if (alreadyLiked) {
      return NextResponse.json({ alreadyLiked: true });
    }

    const Airtable = await import("airtable");
    const base = new Airtable.default({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(process.env.AIRTABLE_BASE_ID!);

    const table = base(process.env.AIRTABLE_TABLE_LIKES!);

    const created = await table.create([
      {
        fields: {
          project: [project],
          user: user,
        },
      },
    ]);

    return NextResponse.json({ success: true, like: created[0] });
  } catch (error) {
    console.error("Erreur POST /api/likes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
