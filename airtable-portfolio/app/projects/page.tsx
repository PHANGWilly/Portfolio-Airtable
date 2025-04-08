"use client"

import { useState } from "react";
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types/Project";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const techIconMap: Record<string, string> = {
  "Next.js": "/next.svg",
  "Tailwind CSS": "/tailwind-css.svg",
  "Prisma": "/prisma-icon.svg",
  "GraphQL": "/graphql.svg",
  "PHP": "/php-logo.svg",
}

const projects: Project[] = [
  {
    id: "1",
    fields: {
      name: "Game Tracker",
      description: "App Next.js avec Tailwind, Prisma et GraphQL. Interface responsive et API typée.",
      link: "https://example.com",
      students: ["Alice", "Bob"],
      visibility: "checked",
      subjects: ["Next.js", "Tailwind CSS", "Prisma"],
      likes: [],
    },
  },
  {
    id: "2",
    fields: {
      name: "Blog CMS",
      description: "Système de blog avec gestion des articles via GraphQL.",
      link: "https://example.com",
      students: ["Charlie"],
      visibility: "checked",
      subjects: ["Next.js", "Tailwind CSS", "GraphQL"],
      likes: [],
    },
  },
  {
    id: "3",
    fields: {
      name: "E-Commerce Dashboard",
      description: "Dashboard admin moderne avec Next.js, Prisma et Tailwind.",
      link: "https://example.com",
      students: ["David", "Emma"],
      visibility: "checked",
      subjects: ["Next.js", "Tailwind CSS", "Prisma"],
      likes: [],
    },
  },
]

export default function ProjectPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
                <CardTitle>{project.fields.name}</CardTitle>
              </CardHeader>

              <CardFooter className="pt-4">
                <div className="flex flex-col items-start space-y-2 w-full">
                  <span className="text-sm font-semibold text-gray-700">Technologies utilisées</span>
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

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="backdrop-blur-sm bg-white/80 border-none max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedProject.fields.name}</DialogTitle>
              <DialogDescription>
                {/* Projet réalisé en <strong>{selectedProject.fields.}</strong>, semestre{" "}
                {selectedProject.fields.Semestre} */}
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
  )
}
