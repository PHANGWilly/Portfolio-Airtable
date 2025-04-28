"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Subject } from "@/types/Subject";
import { Project } from "@/types/Project";
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

export default function SubjectAdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      subject: "",
      year: "",
      cycle: "",
      semester: "",
      description: "",
      projects: [] as string[],
    },
  });

  const fetchData = async () => {
    const [subjectRes, projectRes] = await Promise.all([
      fetch("/api/subjects"),
      fetch("/api/projects"),
    ]);
    const subjectData = await subjectRes.json();
    const projectData = await projectRes.json();
    setSubjects(subjectData);
    setProjects(projectData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      reset({
        name: selectedSubject.fields.name,
        subject: selectedSubject.fields.subject,
        year: selectedSubject.fields.year,
        cycle: selectedSubject.fields.cycle,
        semester: selectedSubject.fields.semester,
        description: selectedSubject.fields.description,
        projects: selectedSubject.fields.projects || [],
      });
    }
  }, [selectedSubject, reset]);

  const updateSubject = async (data: any) => {
    if (!selectedSubject) return;
    try {
      const res = await fetch(`/api/subjects/${selectedSubject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur mise à jour");
      await fetchData();
      setSelectedSubject(null);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
    }
  };

  const createSubject = async (data: any) => {
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erreur création");
      await fetchData();
      setIsCreating(false);
    } catch (err) {
      console.error("Erreur création :", err);
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur suppression");
      await fetchData();
      setSelectedSubject(null);
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Gestion des matières</h1>

        <Button
          className="mb-4"
          onClick={() => {
            setSelectedSubject(null);
            setIsCreating(true);
            setTimeout(() => {
              reset({
                name: "",
                subject: "",
                year: "",
                cycle: "",
                semester: "",
                description: "",
                projects: [],
              });
            }, 0);
          }}
        >
          Ajouter une matière
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="border p-4 rounded-lg shadow-sm bg-white cursor-pointer"
              onClick={() => setSelectedSubject(subject)}
            >
              <h2 className="font-semibold text-lg">{subject.fields.name}</h2>
              <p className="text-sm text-gray-600">
                Année : {subject.fields.year} | S{subject.fields.semester}
              </p>
              <p className="text-sm text-gray-600 italic">{subject.fields.cycle}</p>
            </div>
          ))}
        </div>
      </main>

      {(isCreating || selectedSubject) && (
        <Dialog
          open={isCreating || !!selectedSubject}
          onOpenChange={() => {
            setIsCreating(false);
            setSelectedSubject(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isCreating ? "Ajouter une matière" : "Modifier la matière"}
              </DialogTitle>
              <DialogDescription>
                {isCreating
                  ? "Remplis les infos de la nouvelle matière."
                  : "Modifie les infos de cette matière."}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(isCreating ? createSubject : updateSubject)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <Input {...register("name", { required: true })} placeholder="Nom de la matière" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Code matière</label>
                <Input {...register("subject", { required: true })} placeholder="Code matière (ex: MATH101)" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Année</label>
                <Input {...register("year", { required: true })} placeholder="Année (ex: 2023)" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Semestre</label>
                <Input {...register("semester", { required: true })} placeholder="Semestre (ex: 1 ou 2)" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cycle</label>
                <Input {...register("cycle", { required: true })} placeholder="Cycle (ex: L1, M1...)" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea {...register("description")} placeholder="Description" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Projets associés</label>
                <div className="grid gap-2 max-h-40 overflow-y-auto border p-2 rounded">
                  {projects.map((project) => (
                    <label key={project.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        value={project.id}
                        checked={watch("projects")?.includes(project.id)}
                        onChange={(e) => {
                          const current = watch("projects") || [];
                          if (e.target.checked) {
                            setValue("projects", [...current, project.id]);
                          } else {
                            setValue("projects", current.filter((id: string) => id !== project.id));
                          }
                        }}
                      />
                      {project.fields.name}
                    </label>
                  ))}
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit">{isCreating ? "Créer" : "Mettre à jour"}</Button>
                {!isCreating && selectedSubject && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteSubject(selectedSubject.id)}
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
