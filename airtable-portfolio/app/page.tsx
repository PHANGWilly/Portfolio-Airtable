"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import { Subject } from "@/types/Subject";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import TechFilter from "@/components/TechFilter";
import { techIconMap } from "@/lib/techMap";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching projects and subjects...");
    const fetchData = async () => {
      const [projRes, subjRes] = await Promise.all([fetch("/api/projects"), fetch("/api/subjects")]);
      setProjects(await projRes.json());
      setSubjects(await subjRes.json());
    };

    fetchData();
  }, []);

  const getSubjectNameById = (id: string) => subjects.find((s) => s.id === id)?.fields.name || "Inconnu";

  const filtered = projects.filter((project) => {
    const nameMatch = project.fields.name.toLowerCase().includes(searchTerm.toLowerCase());

    const subjectMatch = project.fields.subjects?.some((subjectId) =>
      getSubjectNameById(subjectId).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const techMatch =
      selectedTechs.length === 0 ||
      project.fields.subjects?.some((id) => {
        const techName = getSubjectNameById(id);
        return selectedTechs.includes(techName);
      });

    return (nameMatch || subjectMatch) && techMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold mb-6">Tous les projets</h1>

      <SearchBar onSearch={setSearchTerm} />
      <TechFilter selected={selectedTechs} onChange={setSelectedTechs} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p>Aucun projet trouvé.</p>
        ) : (
          filtered.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 shadow bg-white">
              <h2 className="text-lg font-semibold mb-2">{project.fields.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{project.fields.description}</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {project.fields.subjects?.map((subjectId, i) => {
                  const tech = getSubjectNameById(subjectId);
                  return (
                    <Image
                      key={i}
                      src={techIconMap[tech] || "/file.svg"}
                      alt={tech}
                      width={30}
                      height={30}
                      title={tech}
                    />
                  );
                })}
              </div>

              {project.fields.link && (
                <a
                  href={project.fields.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  Voir le projet
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
