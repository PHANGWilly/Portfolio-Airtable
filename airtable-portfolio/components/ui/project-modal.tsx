"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Projet } from "@/types/Projet";
import { Button } from "./button";

const techIconMap: Record<string, string> = {
  "Next.js": "/next.svg",
  "Tailwind CSS": "/tailwind-css.svg",
  "Prisma": "/prisma-icon.svg",
  "GraphQL": "/graphql.svg",
  "PHP": "/php-logo.svg",
};

export default function Modal({ project, onClose }: { project: Projet; onClose: () => void }) {
  const { fields } = project;

  return (
        <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/10 backdrop-blur-sm"
        onClick={onClose}
        >
        <div
            className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
        <Card>
          <CardHeader>
            <CardTitle>{fields.Nom}</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground mb-1">
                Projet réalisé en <span className="font-medium text-black">{fields.Annee}</span>, semestre {fields.Semestre}
              </p>
              <p className="text-sm text-muted-foreground">{fields.Description}</p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start space-y-2 w-full">
              <span className="text-sm font-semibold text-gray-700">Technologies utilisées</span>
              <div className="flex space-x-4">
                {fields.Matière?.map((tech, i) => (
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
          </CardContent>
          <CardFooter className="pt-4">
          <Button
            onClick={onClose}
            className="w-full"
          >
            Fermer
          </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
