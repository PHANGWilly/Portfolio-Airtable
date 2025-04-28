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
  const [anonUserId, setAnonUserId] = useState<string | null>(null)

  useEffect(() => {
    let stored = localStorage.getItem("anonUserId")
    if (!stored) {
      stored = `anon_${crypto.randomUUID()}`
      localStorage.setItem("anonUserId", stored)
    }
    setAnonUserId(stored)
  }, [])

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

  const hasLiked = (projectId: string) => {
    const liked = JSON.parse(localStorage.getItem("likedProjects") || "[]")
    return liked.includes(projectId)
  }

  const registerLike = (projectId: string) => {
    const liked = JSON.parse(localStorage.getItem("likedProjects") || "[]")
    const updated = Array.from(new Set([...liked, projectId]))
    localStorage.setItem("likedProjects", JSON.stringify(updated))
  }

  const handleLike = async (project: Project) => {
    if (!anonUserId || hasLiked(project.id)) return

    await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project: project.id,
        user: anonUserId,
      }),
    })

    registerLike(project.id)

    const res = await fetch("/api/projects")
    const data = await res.json()
    setProjects(data)
    setSelectedProject(data.find((p: Project) => p.id === project.id) || null)
  }

  return (
    <div className="p-6">
      <h1 className="text-5xl font-bold my-6">Les Projets</h1>

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

                <CardFooter className="pt-4 flex flex-col items-start space-y-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-700">
                      Technologies utilisées
                    </span>
                    <div className="flex space-x-4 mt-1">
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

                  <span className="text-sm text-gray-600">
                    👍 {project.fields.likes?.length || 0} like(s)
                  </span>
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

            <div className="mt-4 text-center text-sm text-gray-600">
              👍 {selectedProject.fields.likes?.length || 0} like(s)
            </div>

            {hasLiked(selectedProject.id) ? (
              <p className="mt-4 text-green-600 text-center text-sm">
                Vous aimez déjà ce projet !
              </p>
            ) : (
              <button
                onClick={() => handleLike(selectedProject)}
                className="mt-4 w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded"
              >
                👍 J'aime ce projet
              </button>
            )}

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