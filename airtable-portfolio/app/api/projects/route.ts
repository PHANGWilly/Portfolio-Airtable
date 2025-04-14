import { NextRequest, NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Project } from "@/types/Project";
import { Subject } from "@/types/Subject";
import { Like } from "@/types/Like";
import { createProjet } from "@/lib/project";

export async function GET(req: NextRequest) {
  try {
    const allParam = req.nextUrl.searchParams.get("all");
    const showAll = allParam === "true";

    const [projects, subjects, likes] = await Promise.all([
      getTableRecords("project") as Promise<Project[]>,
      getTableRecords("subject") as Promise<Subject[]>,
      getTableRecords("like") as Promise<Like[]>,
    ]);

    const filteredProjects = showAll
      ? projects // 🔥 on garde tout si all=true
      : projects.filter((project) => project.fields.visibility === true);

    const enrichedProjects = filteredProjects.map((project) => {
      const projectId = project.id;

      const relatedSubjects = subjects
        .filter((subject) => subject.fields.projects?.includes(projectId))
        .map((subject) => subject.fields.name);

      const relatedLikes = likes
        .filter((like) => like.fields.project?.includes(projectId))
        .map((like) => like.fields.user?.[0]);

      return {
        ...project,
        fields: {
          ...project.fields,
          subjectNames: relatedSubjects,
          likes: relatedLikes.filter(Boolean),
        },
      };
    });

    return NextResponse.json(enrichedProjects);
  } catch (error) {
    console.error("Erreur GET /api/projects:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRecord = await createProjet(body);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/projects:", error);
    return NextResponse.json({ error: "Erreur création projet" }, { status: 500 });
  }
}
