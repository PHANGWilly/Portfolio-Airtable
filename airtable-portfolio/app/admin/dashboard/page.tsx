"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/project-modal";
import { motion } from "framer-motion";
import Image from "next/image";

const techIconMap: Record<string, string> = {
  "Next.js": "/next.svg",
  "Tailwind CSS": "/tailwind-css.svg",
  "Prisma": "/prisma-icon.svg",
  "GraphQL": "/graphql.svg",
  "PHP": "/php-logo.svg",
  "JavaScript": "/file.svg",
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Erreur de chargement des projets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">Aucun projet trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedProject(project)}
              whileHover={{ scale: 1.02, scaleY: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:bg-gray-50"
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  {project.fields.name}
                </CardTitle>
              </CardHeader>

              <div className="text-sm text-gray-700 mb-2">
                {project.fields.description}
              </div>

              {project.fields.subjects && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Technologies :
                  </p>
                  <div className="flex gap-2 flex-wrap">
                  {project.fields.subjects?.map((tech, i) => (
                    <Image
                        key={i}
                        src={techIconMap[tech] || "/file.svg"}
                        alt={tech}
                        width={36}
                        height={36}
                        title={tech}
                    />
                    ))}
                  </div>
                </div>
              )}

              {project.fields.link && (
                <a
                  href={project.fields.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-xs underline"
                >
                  Voir le projet
                </a>
              )}

              <CardFooter className="mt-4 flex justify-between text-xs text-gray-500">
                <span>👍 {project.fields.likes?.length || 0} like(s)</span>
              </CardFooter>
            </motion.div>
          ))}
        </div>
      )}

      {selectedProject && (
        <Modal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}