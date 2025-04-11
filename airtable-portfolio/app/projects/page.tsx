"use client"

import { useEffect, useState } from "react"
import { CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"
import { Project } from "@/types/Project"
import { Subject } from "@/types/Subject"
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
  "JavaScript": "/java-script.svg",
  "Symfony": "/symfony.svg",
  "test": "/test.svg",
  "NodeJS": "/Node.js_logo.svg",
  "Go": "/golang.svg"
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, subjRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/subjects"),
        ])

        const projectsData = await projRes.json()
        const subjectsData = await subjRes.json()

        setProjects(projectsData)
        setSubjects(subjectsData)
      } catch (err) {
        console.error("Erreur de chargement:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getSubjectNameById = (id: string) =>
    subjects.find((s) => s.id === id)?.fields.name || "Inconnu"

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Projets</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
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
                    <span className="text-sm font-semibold text-gray-700">
                      Technologies utilisées
                    </span>
                    <div className="flex space-x-4">
                      {project.fields.subjects?.map((subjectId, i) => {
                        const subjectName = getSubjectNameById(subjectId)
                        return (
                          <Image
                            key={i}
                            src={techIconMap[subjectName] || "/file.svg"}
                            alt={subjectName}
                            width={36}
                            height={36}
                            title={subjectName}
                          />
                        )
                      })}
                    </div>
                  </div>
                </CardFooter>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="backdrop-blur-sm bg-white/80 border-none max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedProject.fields.name}</DialogTitle>
              <DialogDescription>
                {selectedProject.fields.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <p className="font-semibold mb-2">Technologies utilisées</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {selectedProject.fields.subjects?.map((id, i) => (
                  <li key={i}>{getSubjectNameById(id)}</li>
                ))}
              </ul>
            </div>

            {selectedProject.fields.link && (
              <a
                href={selectedProject.fields.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center bg-gray-100 hover:bg-gray-200 rounded px-4 py-2 text-sm font-medium text-gray-800"
              >
                Voir le projet
              </a>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
