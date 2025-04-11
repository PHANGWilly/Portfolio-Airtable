"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Project } from "@/types/Project";
import { Student } from "@/types/Student";
import { Subject } from "@/types/Subject";
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);


  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      link: "",
      students: [] as string[],
      subjects: [] as string[],
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

    const fetchSubjects = async () => {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    };

    fetchProjects();
    fetchStudents();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      reset({
        name: selectedProject.fields.name,
        description: selectedProject.fields.description || "",
        link: selectedProject.fields.link || "",
        students: selectedProject.fields.students || [],
        subjects: selectedProject.fields.subjects || [],
        visibility: !!selectedProject.fields.visibility,
      });

      setValue("students", selectedProject.fields.students || []);
      setValue("subjects", selectedProject.fields.subjects || []);
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
          subjects: Array.isArray(data.subjects)
            ? data.subjects
            : [data.subjects].filter(Boolean),
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

  const createProject = async (data: any) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          link: data.link,
          students: Array.isArray(data.students) ? data.students : [data.students].filter(Boolean),
          subjects: Array.isArray(data.subjects) ? data.subjects : [data.subjects].filter(Boolean),
          visibility: !!data.visibility,
        }),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur création");
      }
  
      const updated = await fetch("/api/projects");
      const json = await updated.json();
      setProjects(json);
      setIsCreating(false);
    } catch (err) {
      console.error("Erreur création :", err);
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

            <Button onClick={() => {
              reset(); 
              setIsCreating(true);
            }}>Ajouter un projet</Button>


        </div>
      )}

{isCreating && (
  <Dialog open={isCreating} onOpenChange={() => setIsCreating(false)}>
    <DialogContent className="backdrop-blur-sm bg-white/80 border-none max-w-lg">
      <DialogHeader>
        <DialogTitle>Créer un projet</DialogTitle>
        <DialogDescription>Remplis les champs pour ajouter un nouveau projet.</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(createProject)} className="space-y-4">
        <Input {...register("name", { required: true })} placeholder="Nom du projet" />
        <Textarea {...register("description")} placeholder="Description" />
        <Input {...register("link")} placeholder="Lien du projet" />

        {/* Étudiants */}
        <label className="flex flex-col text-sm gap-2">
          Étudiants associés
          <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {students.map((student) => (
              <label key={student.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={student.id}
                  checked={watch("students")?.includes(student.id)}
                  onChange={(e) => {
                    const current = watch("students") || [];
                    if (e.target.checked) {
                      setValue("students", [...current, student.id]);
                    } else {
                      setValue("students", current.filter((id: string) => id !== student.id));
                    }
                  }}
                />
                {student.fields.firstname} {student.fields.lastname}
              </label>
            ))}
          </div>
        </label>

        {/* Subjects */}
        <label className="flex flex-col text-sm gap-2">
          Matières associées
          <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {subjects.map((subject) => (
              <label key={subject.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={subject.id}
                  checked={watch("subjects")?.includes(subject.id)}
                  onChange={(e) => {
                    const current = watch("subjects") || [];
                    if (e.target.checked) {
                      setValue("subjects", [...current, subject.id]);
                    } else {
                      setValue("subjects", current.filter((id: string) => id !== subject.id));
                    }
                  }}
                />
                {subject.fields.name} — S{subject.fields.semester} {subject.fields.year}
              </label>
            ))}
          </div>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("visibility")} />
          Visible
        </label>

        <DialogFooter>
          <Button type="submit">Créer</Button>
          <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Annuler</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
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

              {/* Étudiants */}
              <label className="flex flex-col text-sm gap-2">
                Étudiants associés
                <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {students.map((student) => (
                    <label key={student.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={student.id}
                        checked={watch("students")?.includes(student.id)}
                        onChange={(e) => {
                          const current = watch("students") || [];
                          if (e.target.checked) {
                            setValue("students", [...current, student.id]);
                          } else {
                            setValue(
                              "students",
                              current.filter((id: string) => id !== student.id)
                            );
                          }
                        }}
                      />
                      {student.fields.firstname} {student.fields.lastname}
                    </label>
                  ))}
                </div>
              </label>

              {/* Subjects */}
              <label className="flex flex-col text-sm gap-2">
                Matières associées
                <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {subjects.map((subject) => (
                    <label key={subject.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={subject.id}
                        checked={watch("subjects")?.includes(subject.id)}
                        onChange={(e) => {
                          const current = watch("subjects") || [];
                          if (e.target.checked) {
                            setValue("subjects", [...current, subject.id]);
                          } else {
                            setValue(
                              "subjects",
                              current.filter((id: string) => id !== subject.id)
                            );
                          }
                        }}
                      />
                      {subject.fields.name} — S{subject.fields.semester} {subject.fields.year}
                    </label>
                  ))}
                </div>
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("visibility")} />
                Visible
              </label>

              <DialogFooter>
                <Button type="submit">Enregistrer</Button>

               <Button
                  type="button"
                  variant="destructive"
                  onClick={async () => {
                    if (!selectedProject) return;
                    if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

                    try {

                      const res = await fetch(`/api/projects/${selectedProject.id}`, {
                        method: "DELETE",
                      });

                      const result = await res.json();

                      if (!res.ok) throw new Error("Erreur suppression");

                      const updated = await fetch("/api/projects");
                      const data = await updated.json();
                      setProjects(data);
                      setSelectedProject(null);
                    } catch (err) {
                      console.error("Erreur suppression :", err);
                      alert("La suppression a échoué.");
                    }
                  }}
                  >
                  Supprimer
                </Button>

              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}