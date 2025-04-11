"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Project } from "@/types/Project";
import { Student } from "@/types/Student";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name: "",
      description: "",
      link: "",
      students: [] as string[],
      subjects: "",
      visibility: true,
    },
  });

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    };

    const fetchStudents = async () => {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data);
    };

    fetchProjects();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      reset({
        name: selectedProject.fields.name,
        description: selectedProject.fields.description || "",
        link: selectedProject.fields.link || "",
        students: selectedProject.fields.students || [],
        subjects: selectedProject.fields.subjects?.join(", ") || "",
        visibility: !!selectedProject.fields.visibility,
      });
      setValue("students", selectedProject.fields.students || []);
    }
  }, [selectedProject, reset, setValue]);

  const updateProject = async (data: any) => {
    if (!selectedProject) return;

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          link: data.link,
          students: Array.isArray(data.students)
            ? data.students
            : [data.students].filter(Boolean),
          subjects: data.subjects
            ?.split(",")
            .map((s: string) => s.trim())
            .filter(Boolean),
          visibility: !!data.visibility,
        }),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      const updatedList = await fetch("/api/projects");
      const json = await updatedList.json();
      setProjects(json);
      setSelectedProject(null);
    } catch (err) {
      console.error("Erreur update :", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">Aucun projet trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
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
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="backdrop-blur-sm bg-white/80 border-none max-w-lg">
            <DialogHeader>
              <DialogTitle>Modifier le projet</DialogTitle>
              <DialogDescription>
                Tu peux éditer les infos du projet ici.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(updateProject)} className="space-y-4">
              <Input {...register("name", { required: true })} placeholder="Nom du projet" />
              <Textarea {...register("description")} placeholder="Description" />
              <Input {...register("link")} placeholder="Lien du projet" />

              {/* Sélection des étudiants */}
              <label className="flex flex-col text-sm gap-2">
                Étudiants associés
                <select
                  {...register("students")} 
                  onChange={(e) =>
                    setValue(
                      "students",
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                  multiple
                  className="border rounded px-2 py-1 bg-white text-sm"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.fields.firstname} {student.fields.lastname}
                    </option>
                  ))}
                </select>
              </label>

              <Input {...register("subjects")} placeholder="Technologies (ex: Tailwind, PHP)" />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("visibility")} />
                Visible
              </label>

              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
