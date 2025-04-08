"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Project } from "@/types/Project";

const techIconMap: Record<string, string> = {
  "Next.js": "/next.svg",
  "Tailwind CSS": "/tailwind-css.svg",
  "Prisma": "/prisma-icon.svg",
  "GraphQL": "/graphql.svg",
  "PHP": "/php-logo.svg",
  "JavaScript": "/file.svg",
};

type ModalProps = {
  project: Project;
  onClose: () => void;
};

export default function Modal({ project, onClose }: ModalProps) {
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
            <CardTitle>{fields.name}</CardTitle>
            <CardDescription>
              <p className="text-sm text-muted-foreground">
                {fields.description || "Pas de description"}
              </p>
            </CardDescription>
          </CardHeader>

          {fields.subjects && (
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
          )}
        </Card>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-100 text-gray-800 py-2 rounded hover:bg-gray-200"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
