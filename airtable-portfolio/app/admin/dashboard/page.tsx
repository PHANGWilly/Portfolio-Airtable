"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Project } from "@/types/Project";
import { Student } from "@/types/Student";
import { Subject } from "@/types/Subject";
import AdminNavbar from "@/components/AdminNavbar";
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

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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

  const fetchData = async () => {
    const [resProjects, resStudents, resSubjects] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/students"),
      fetch("/api/subjects"),
    ]);
    setProjects(await resProjects.json());
    setStudents(await resStudents.json());
    setSubjects(await resSubjects.json());
  };

  useEffect(() => {
    fetchData();
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
    }
  }, [selectedProject, reset]);

  const updateProject = async (data: any) => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          students: Array.isArray(data.students) ? data.students : [],
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
        }),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      await fetchData();
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
          ...data,
          students: Array.isArray(data.students) ? data.students : [],
          subjects: Array.isArray(data.subjects) ? data.subjects : [],
        }),
      });

      if (!res.ok) throw new Error("Erreur création");

      await fetchData();
      setIsCreating(false);
    } catch (err) {
      console.error("Erreur création :", err);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      await fetchData();
      setSelectedProject(null);
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Gestion des projets</h1>

        <Button
  className="mb-6"
  onClick={() => {
    setSelectedProject(null);
    setIsCreating(true);

    setTimeout(() => {
      reset({
        name: "",
        description: "",
        link: "",
        students: [],
        subjects: [],
        visibility: true,
      });
    }, 0);
  }}
>
  Ajouter un projet
</Button>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
            >
              <h2 className="font-semibold text-lg">{project.fields.name}</h2>
              <p className="text-sm text-gray-600">{project.fields.description}</p>
              <p className="text-sm text-gray-400 italic">{project.fields.link}</p>
            </div>
          ))}
        </div>
      </main>

      {(isCreating || selectedProject) && (
        <Dialog open={isCreating || !!selectedProject} onOpenChange={() => {
          setIsCreating(false);
          setSelectedProject(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? "Ajouter un projet" : "Modifier le projet"}</DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Remplis les infos du projet."
                  : "Tu peux modifier les infos du projet."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(isCreating ? createProject : updateProject)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom du projet</label>
                <Input {...register("name", { required: true })} placeholder="Nom du projet" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea {...register("description")} placeholder="Description" />
              </div>

              <div>
                <label className="text-sm font-medium">Lien du projet</label>
                <Input {...register("link")} placeholder="Lien (facultatif)" />
              </div>

              <div>
                <label className="text-sm font-medium">Étudiants associés</label>
                <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {students.map((student) => (
                    <label key={student.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={student.id}
                        checked={watch("students")?.includes(student.id)}
                        onChange={(e) => {
                          const current = watch("students") || [];
                          setValue("students", e.target.checked
                            ? [...current, student.id]
                            : current.filter((id: string) => id !== student.id));
                        }}
                      />
                      {student.fields.firstname} {student.fields.lastname}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Matières associées</label>
                <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {subjects.map((subject) => (
                    <label key={subject.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={subject.id}
                        checked={watch("subjects")?.includes(subject.id)}
                        onChange={(e) => {
                          const current = watch("subjects") || [];
                          setValue("subjects", e.target.checked
                            ? [...current, subject.id]
                            : current.filter((id: string) => id !== subject.id));
                        }}
                      />
                      {subject.fields.name} (S{subject.fields.semester} - {subject.fields.year})
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("visibility")} />
                Visible
              </label>

              <DialogFooter className="pt-4">
                <Button type="submit">{isCreating ? "Créer" : "Mettre à jour"}</Button>
                {!isCreating && selectedProject && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteProject(selectedProject.id)}
                  >
                    Supprimer
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
