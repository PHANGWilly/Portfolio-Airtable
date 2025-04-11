import { NextResponse } from "next/server";
import { getTableRecords } from "@/utils/airtable";
import { Project } from "@/types/Project";
import { Subject } from "@/types/Subject";

export async function GET() {
  try {
    const [subjects, projects] = await Promise.all([
      getTableRecords("subject") as Promise<Subject[]>,
      getTableRecords("project") as Promise<Project[]>,
    ]);

    const enrichedSubjects = subjects.map((subject) => {
      const subjectId = subject.id;

      const relatedProjects = projects
        .filter((project) =>
          project.fields.subjects?.includes(subjectId)
        )
        .map((project) => project.fields.name);

      return {
        ...subject,
        fields: {
          ...subject.fields,
          projects: relatedProjects,
        },
      };
    });

    enrichedSubjects.sort((a, b) => {
      const yearA = parseInt(a.fields.year ?? "0", 10);
      const yearB = parseInt(b.fields.year ?? "0", 10);
      if (yearA !== yearB) return yearA - yearB;

      const semesterA = parseInt(a.fields.semester ?? "0", 10);
      const semesterB = parseInt(b.fields.semester ?? "0", 10);
      if (semesterA !== semesterB) return semesterA - semesterB;

      const nameA = a.fields.name?.toLowerCase() ?? "";
      const nameB = b.fields.name?.toLowerCase() ?? "";
      return nameA.localeCompare(nameB);
    });

    return NextResponse.json(enrichedSubjects);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
