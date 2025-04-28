"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Project } from "@/types/Project";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Props = {
  projects: Project[];
};

export default function ProjectStatsChart({ projects }: Props) {
  const totalProjects = projects.length;

  const sortedByLikes = [...projects]
    .sort((a, b) => (b.fields.likes?.length || 0) - (a.fields.likes?.length || 0))
    .slice(0, 5);

  const data = {
    labels: sortedByLikes.map((p) => p.fields.name),
    datasets: [
      {
        label: "Likes",
        data: sortedByLikes.map((p) => p.fields.likes?.length || 0),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Statistiques des projets</h2>
      <p className="mb-4 text-gray-600">
        Nombre total de projets : <strong>{totalProjects}</strong>
      </p>
      <Bar data={data} height={200} />
    </div>
  );
}
