"use client";

import { useEffect, useState } from "react";
import { Subject } from "@/types/Subject";
import { Project } from "@/types/Project";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subjectRes, projectRes] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/projects"),
        ]);

        const subjectData = await subjectRes.json();
        const projectData = await projectRes.json();

        setSubjects(subjectData);
        setProjects(projectData);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedByYear = subjects.reduce<Record<string, Subject[]>>((acc, subject) => {
    const year = subject.fields.year || "Autre";
    if (!acc[year]) acc[year] = [];
    acc[year].push(subject);
    return acc;
  }, {});

  const getProjectName = (id: string) =>
    projects.find((proj) => proj.id === id)?.fields.name || id;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold my-6">Matières Enseignées</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        Object.entries(groupedByYear).map(([year, yearSubjects]) => {
          const cycle = yearSubjects[0]?.fields.cycle || "N/A";

          const groupedBySemester = yearSubjects.reduce<Record<string, Subject[]>>((acc, subject) => {
            const semester = subject.fields.semester || "Autre";
            if (!acc[semester]) acc[semester] = [];
            acc[semester].push(subject);
            return acc;
          }, {});

          return (
            <div key={year} className="mb-12">
              <h2 className="text-2xl mb-4 font-bold">
                Année {year} - {cycle}
              </h2>

              {["1", "2", "3", "4"].map((semesterKey) => {
                const semesterSubjects = groupedBySemester[semesterKey];
                if (!semesterSubjects) return null;

                return (
                  <div key={semesterKey} className="mb-10">
                    <h3 className="text-lg font-semibold mb-3">
                      Semestre {semesterKey}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {semesterSubjects.map((subject) => (
                        <Card key={subject.id} className="bg-white shadow-md">
                          <CardHeader>
                            <h4 className="font-bold text-lg text-gray-800">
                              {subject.fields.name}
                            </h4>
                          </CardHeader>

                          <CardContent className="text-sm text-gray-700 space-y-2">
                            <div>
                              <span className="font-semibold">Description : </span>
                              {subject.fields.description || "—"}
                            </div>

                            <div>
                              <span className="font-semibold">Code : </span>
                              {subject.fields.subject}
                            </div>

                            <div>
                              <span className="font-semibold">Cycle : </span>
                              {subject.fields.cycle}
                            </div>
                          </CardContent>

                          <CardFooter className="flex flex-col items-start space-y-2">
                            <h6 className="font-semibold text-sm">Projets liés :</h6>
                            {subject.fields.projects?.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {subject.fields.projects.map((projectId, index) => (
                                  <Badge key={index}>
                                    {getProjectName(projectId)}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm italic">
                                Aucun projet associé
                              </span>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}
