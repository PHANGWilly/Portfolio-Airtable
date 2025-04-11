"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Subject } from "@/types/Subject"
import { useEffect, useState } from "react"

export default function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/subjects")
        const data = await res.json()
        console.log("Résultat API Subjects:", data)
        setSubjects(data)
      } catch (err) {
        console.error("Erreur de chargement des matières:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  // Regrouper les subjects par année
  const groupedByYear = subjects.reduce<Record<string, Subject[]>>((acc, subject) => {
    const year = subject.fields.year || "Autre"
    if (!acc[year]) {
      acc[year] = []
    }
    acc[year].push(subject)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-5xl font-bold my-6">Matières Enseignées</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        Object.entries(groupedByYear).map(([year, yearSubjects]) => {
          const cycle = yearSubjects[0]?.fields.cycle || "N/A"

          const groupedBySemester = yearSubjects.reduce<Record<string, Subject[]>>((acc, subject) => {
            const semester = subject.fields.semester || "Autre"
            if (!acc[semester]) {
              acc[semester] = []
            }
            acc[semester].push(subject)
            return acc
          }, {})

          return (
            <div key={year} className="mb-12">
              <h2 className="text-2xl mb-4 font-bold">Année {year} - {cycle}</h2>

              {["1", "2", "3", "4"].map((semesterKey) => {
                const semesterSubjects = groupedBySemester[semesterKey]
                if (!semesterSubjects) return null

                return (
                  <div key={semesterKey} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2">Semestre {semesterKey}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {semesterSubjects.map((subject) => (
                        <Card key={subject.id}>
                          <CardHeader>
                            <span className="font-bold">{subject.fields.name}</span>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-bold">Ce que vous allez apprendre : </h4>
                            <div>
                              {subject.fields.description}
                            </div>
                          </CardContent>
                          <CardFooter className="grid grid-cols-1 gap-2">
                            <h6 className="font-black">Projets au cours du semestre :</h6>
                            {subject.fields.projects?.length > 0 ? (
                              subject.fields.projects.map((project, index) => (
                                <Badge
                                  key={index}
                                >
                                  {project}
                                </Badge>
                              ))
                            ) : (
                              <div className="text-gray-400 text-sm italic">Aucun projet associé</div>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}
