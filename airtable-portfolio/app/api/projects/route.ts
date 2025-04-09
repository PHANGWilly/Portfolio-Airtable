import { NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Project } from "@/types/Project";
import { Subject } from "@/types/Subject";

export async function GET() {
  try {
    const [projects, subjects] = await Promise.all([
      getTableRecords("project") as Promise<Project[]>,
      getTableRecords("subject") as Promise<Subject[]>,
    ]);

    const enrichedProjects = projects.map((project) => {
      const projectId = project.id;

      const relatedSubjects = subjects
        .filter((subject) =>
          subject.fields.projects?.includes(projectId)
        )
        .map((subject) => subject.fields.name);

      return {
        ...project,
        fields: {
          ...project.fields,
          subjects: relatedSubjects, 
        },
      };
    });

    return NextResponse.json(enrichedProjects);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
