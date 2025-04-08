"use client";

import { useState } from "react";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Modal from "@/components/ui/project-modal"; 
import { Projet } from "@/types/Projet";

const techIconMap: Record<string, string> = {
  "Next.js": "/next.svg",
  "Tailwind CSS": "/tailwind-css.svg",
  "Prisma": "/prisma-icon.svg",
  "GraphQL": "/graphql.svg",
  "PHP": "/php-logo.svg",
};

const projects: Projet[] = [
  {
    id: "1",
    fields: {
      Nom: "Game Tracker",
      Description: "App Next.js avec Tailwind, Prisma et GraphQL. Interface responsive et API typée.",
      Lien: "https://example.com",
      Etudiants: ["Alice", "Bob"],
      Visibilité: true,
      Matière: ["Next.js", "Tailwind CSS", "Prisma"],
      Likes: [],
      Semestre: "S1",
      Annee: 2023,
    },
  },
  {
    id: "2",
    fields: {
      Nom: "Blog CMS",
      Description: "Système de blog avec gestion des articles via GraphQL.",
      Lien: "https://example.com",
      Etudiants: ["Charlie"],
      Visibilité: true,
      Matière: ["Next.js", "Tailwind CSS", "GraphQL"],
      Likes: [],
      Semestre: "S2",
      Annee: 2022,
    },
  },
  {
    id: "3",
    fields: {
      Nom: "E-Commerce Dashboard",
      Description: "Dashboard admin moderne avec Next.js, Prisma et Tailwind.",
      Lien: "https://example.com",
      Etudiants: ["David", "Emma"],
      Visibilité: true,
      Matière: ["Next.js", "Tailwind CSS", "Prisma"],
      Likes: [],
      Semestre: "S1",
      Annee: 2024,
    },
  },
];

export default function ProjectPage() {
  const [selectedProject, setSelectedProject] = useState<Projet | null>(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Projets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            onClick={() => setSelectedProject(project)}
            whileHover={{
              scale: 1.02,
              scaleY: 0.96,
              boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full rounded-xl bg-white shadow-md cursor-pointer"
          >
            <div className="p-4">
              <CardHeader>
                <CardTitle>{project.fields.Nom}</CardTitle>
              </CardHeader>

              <CardFooter className="pt-4">
                <div className="flex flex-col items-start space-y-2 w-full">
                  <span className="text-sm font-semibold text-gray-700">Technologies utilisées</span>
                  <div className="flex space-x-4">
                    {project.fields.Matière?.map((tech, i) => (
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
              </CardFooter>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProject && (
        <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
