"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
              key={project.id}
              onClick={() => setSelectedProject(project)}
              whileHover={{ scale: 1.02, scaleY: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full rounded-xl bg-white shadow-md cursor-pointer"
            >
              <div className="p-4">
                <CardHeader>
                  <CardTitle>{project.fields.name}</CardTitle>
                </CardHeader>

                <CardFooter className="pt-4">
                  <div className="flex flex-col items-start space-y-2 w-full">
                    <span className="text-sm font-semibold text-gray-700">
                      Technologies utilisées
                    </span>
                    <div className="flex space-x-4">
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
                </CardFooter>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedProject && (
        <Dialog
          open={!!selectedProject}
          onOpenChange={() => setSelectedProject(null)}
        >
          <DialogContent className="backdrop-blur-sm bg-white/80 border-none max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedProject.fields.name}</DialogTitle>
              <DialogDescription>
                {/* Tu peux ajouter semestre/année ici si besoin */}
              </DialogDescription>
            </DialogHeader>

            <p className="text-sm text-muted-foreground mt-2">
              {selectedProject.fields.description}
            </p>

            <div className="mt-4">
              <p className="font-semibold mb-2">Technologies utilisées</p>
              <div className="flex space-x-4">
                {selectedProject.fields.subjects?.map((tech, i) => (
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}