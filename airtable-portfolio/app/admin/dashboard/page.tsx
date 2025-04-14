"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types/Project";
import AdminNavbar from "@/components/AdminNavbar";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects?all=true");
      const data = await res.json();
      setProjects(data);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const totalProjects = projects.length;
  const visibleCount = projects.filter((p) => p.fields.visibility).length;
  const hiddenCount = totalProjects - visibleCount;

  const topLiked = [...projects]
    .sort((a, b) => (b.fields.likes?.length || 0) - (a.fields.likes?.length || 0))
    .slice(0, 5);

  const chartData = {
    labels: topLiked.map((p) => p.fields.name),
    datasets: [
      {
        label: "Likes",
        data: topLiked.map((p) => p.fields.likes?.length || 0),
        backgroundColor: "rgba(59,130,246,0.6)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="flex">
      <AdminNavbar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard des projets</h1>

        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-1">Total projets</h2>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-1">Projets visibles</h2>
                <p className="text-2xl font-bold text-green-600">{visibleCount}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-1">Projets non visibles</h2>
                <p className="text-2xl font-bold text-red-500">{hiddenCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Top 5 projets les plus likés</h2>
              {topLiked.length > 0 ? (
                <Bar data={chartData} height={220} />
              ) : (
                <p className="text-sm text-gray-500">Aucun like enregistré pour le moment.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
