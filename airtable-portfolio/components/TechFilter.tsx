"use client";
import { techIconMap } from "@/lib/techMap";

type Props = {
  selected: string[];
  onChange: (updated: string[]) => void;
};

export default function TechFilter({ selected, onChange }: Props) {
  const toggleTech = (tech: string) => {
    if (selected.includes(tech)) {
      onChange(selected.filter((t) => t !== tech));
    } else {
      onChange([...selected, tech]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {Object.keys(techIconMap).map((tech) => (
        <button
          key={tech}
          onClick={() => toggleTech(tech)}
          className={`px-3 py-1 border rounded-full text-sm ${
            selected.includes(tech) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {tech}
        </button>
      ))}
    </div>
  );
}
