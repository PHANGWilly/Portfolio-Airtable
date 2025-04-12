"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Student } from "@/types/Student";
import { Project } from "@/types/Project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StudentAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      class: "",
      projects: [] as string[],
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const studentRes = await fetch("/api/students");
    const studentData = await studentRes.json();
    console.log("📦 Données reçues de /api/students :", studentData);

    setStudents(studentData);

    const projectRes = await fetch("/api/projects");
    const projectData = await projectRes.json();
    setProjects(projectData);
  };

  useEffect(() => {
    if (selectedStudent) {
      reset({
        firstname: selectedStudent.fields.firstname,
        lastname: selectedStudent.fields.lastname,
        email: selectedStudent.fields.email,
        class: selectedStudent.fields.class,
        projects: selectedStudent.fields.projects || [],
      });
    }
  }, [selectedStudent, reset]);

  const updateStudent = async (data: any) => {
    if (!selectedStudent) return;

    try {
      const res = await fetch(`/api/students/${selectedStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur mise à jour");

      await fetchData();
      setSelectedStudent(null);
    } catch (err) {
      console.error("Erreur mise à jour étudiant :", err);
    }
  };

  const createStudent = async (data: any) => {
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur création");

      await fetchData();
      setIsCreating(false);
    } catch (err) {
      console.error("Erreur création étudiant :", err);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) return;
  
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });
  
      if (!res.ok) throw new Error("Erreur suppression");
  
      await fetchData();
      setSelectedStudent(null); 
    } catch (err) {
      console.error("Erreur suppression étudiant :", err);
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des étudiants</h1>

      <Button onClick={() => {
        reset();              
        setSelectedStudent(null); 
        setIsCreating(true);   
        }}>
        Ajouter un étudiant
      </Button>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="border p-4 rounded-lg shadow-sm cursor-pointer bg-white"
            onClick={() => setSelectedStudent(student)}
          >
            <h2 className="font-semibold text-lg">{student.fields.firstname} {student.fields.lastname}</h2>
            <p className="text-sm text-gray-600">{student.fields.email}</p>
            <p className="text-sm text-gray-600">Classe : {student.fields.class}</p>
          </div>
        ))}
      </div>

      {(isCreating || selectedStudent) && (
        <Dialog open={isCreating || !!selectedStudent} onOpenChange={() => {
          setIsCreating(false);
          setSelectedStudent(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isCreating ? "Ajouter un étudiant" : "Modifier l’étudiant"}</DialogTitle>
              <DialogDescription>
                {isCreating ? "Remplis le formulaire pour ajouter un étudiant." : "Tu peux modifier les infos de l’étudiant."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(isCreating ? createStudent : updateStudent)} className="space-y-4">
              <Input {...register("firstname", { required: true })} placeholder="Prénom" />
              <Input {...register("lastname", { required: true })} placeholder="Nom" />
              <Input {...register("email", { required: true })} placeholder="Email" />
              <Input {...register("class", { required: true })} placeholder="Classe" />

              <label className="block text-sm font-medium">Projets associés</label>
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

              <DialogFooter className="pt-4">
                <Button type="submit">{isCreating ? "Créer" : "Mettre à jour"}</Button>
                {!isCreating && selectedStudent && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => deleteStudent(selectedStudent.id)}
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
