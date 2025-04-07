"use client";

import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "Game Tracker",
    year: "2023",
    description: "App Next.js avec Tailwind, Prisma et GraphQL. Interface responsive et API typée.",
    note: "5/5",
    techs: [
      { name: "Next.js", src: "/next.svg" },
      { name: "Tailwind CSS", src: "/tailwind-css.svg" },
      { name: "Prisma", src: "/prisma-icon.svg" },
    ],
  },
  {
    title: "Blog CMS",
    year: "2022",
    description: "Système de blog avec gestion des articles via GraphQL et UI Tailwind responsive.",
    note: "5/5",
    techs: [
      { name: "Next.js", src: "/next.svg" },
      { name: "Tailwind CSS", src: "/tailwind-css.svg" },
      { name: "GraphQL", src: "/graphql.svg" },
    ],
  },
  {
    title: "E-Commerce Dashboard",
    year: "2024",
    description: "Dashboard admin moderne avec Next.js, Prisma et Tailwind.",
    note: "5/5",

    techs: [
      { name: "Next.js", src: "/next.svg" },
      { name: "Tailwind CSS", src: "/tailwind-css.svg" },
      { name: "Prisma", src: "/prisma-icon.svg" },
    ],
  },
];

export default function ProjectPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Projets</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            whileHover={{
              scale: 1.02,
              scaleY: 0.96,
              boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="w-full rounded-xl bg-white shadow-md cursor-pointer"
          >
            <div className="p-4">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  <p className="text-sm text-muted-foreground mb-1">
                    Projet réalisé en <span className="font-medium text-black">{project.year}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardDescription>
                <CardDescription>
                  <p className="text-sm text-muted-foreground mb-1">
                    note donnée par des particuliers <span className="font-medium text-black">{project.note}</span>
                  </p>
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-4">
                <div className="flex flex-col items-start space-y-2 w-full">
                  <span className="text-sm font-semibold text-gray-700">Technologies utilisées</span>
                  <div className="flex space-x-4">
                    {project.techs.map((tech, i) => (
                      <Image key={i} src={tech.src} alt={tech.name} width={36} height={36} title={tech.name} />
                    ))}
                  </div>
                </div>
              </CardFooter>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
